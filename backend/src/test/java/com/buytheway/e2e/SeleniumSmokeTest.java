package com.buytheway.e2e;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.stream.Stream;

import org.junit.jupiter.api.AfterAll;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assumptions.assumeTrue;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.DynamicTest;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestFactory;
import org.junit.jupiter.api.TestMethodOrder;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class SeleniumSmokeTest {

    private record PublicPage(String route, List<String> expectedTexts) {}

        private static final String FRONTEND_BASE_URL = System.getProperty(
            "frontendBaseUrl",
            System.getProperty("frontend.baseUrl", "http://localhost:8081")
        );
    private static final boolean E2E_ENABLED = Boolean.parseBoolean(System.getProperty("e2e", "false"));
    private static final boolean HEADLESS = Boolean.parseBoolean(
            System.getProperty("seleniumHeadless", System.getProperty("selenium.headless", "true"))
    );
    private static final Duration FRONTEND_WAIT_TIMEOUT = Duration.ofSeconds(45);

    private static WebDriver driver;
    private static WebDriverWait wait;

    @BeforeAll
    static void setUp() {
        assumeTrue(E2E_ENABLED, "Enable Selenium smoke tests with -De2e=true");
        driver = createDriver();
        wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(0));
        driver.manage().window().maximize();
    }

    @AfterAll
    static void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    @TestFactory
    @Order(1)
    @DisplayName("Public routes render expected content")
    Stream<DynamicTest> publicRoutesRenderExpectedContent() {
        List<PublicPage> pages = List.of(
                new PublicPage("/", List.of("Register Now", "500+ Happy Customers")),
                new PublicPage("/login", List.of("Welcome back", "Login to continue your experience")),
                new PublicPage("/register", List.of("Create your account", "Start your journey with us")),
                new PublicPage("/vendor-register", List.of("Create your account", "Start your journey with us")),
                new PublicPage("/shop", List.of("Filters", "Brand / Vendor")),
                new PublicPage("/product/3", List.of("Back to Products", "Add to Cart")),
                new PublicPage("/cart", List.of("Cart", "Checkout")),
                new PublicPage("/checkout", List.of("Checkout", "Place Order")),
                new PublicPage("/order-tracking", List.of("Track Your Order", "Enter your order ID")),
                new PublicPage("/order-history", List.of("My Orders")),
                new PublicPage("/about", List.of("About Buy the Way", "Our Story")),
                new PublicPage("/faq", List.of("Frequently Asked Questions", "What payment methods do you accept?")),
                new PublicPage("/returns", List.of("Returns & Refunds", "14-Day Returns")),
                new PublicPage("/terms", List.of("Terms of Service", "Account Responsibilities")),
                new PublicPage("/privacy", List.of("Privacy Policy", "Data Collection")),
                new PublicPage("/this-route-does-not-exist", List.of("404", "Oops! Page not found"))
        );

        return pages.stream().map(page -> DynamicTest.dynamicTest(page.route(), () -> {
            open(page.route());
            for (String text : page.expectedTexts()) {
                assertContainsText(text);
            }
        }));
    }

    @TestFactory
    @Order(2)
    @DisplayName("Protected routes redirect anonymous users to login")
    Stream<DynamicTest> protectedRoutesRedirectToLogin() {
        List<String> protectedRoutes = List.of(
                "/profile",
                "/vendor",
                "/vendor/add-product",
                "/vendor/products",
                "/vendor/inventory",
                "/admin",
                "/admin/approvals",
                "/admin/reports",
                "/admin/categories",
                "/admin/vendors"
        );

        return protectedRoutes.stream().map(path -> DynamicTest.dynamicTest(path, () -> {
            open(path);
            wait.until(ExpectedConditions.urlContains("/login"));
            assertContainsText("Welcome back");
        }));
    }

    @Test
    @Order(3)
    @DisplayName("Optional login flow works when credentials are provided")
    void loginFlowWorksWithCredentials() {
        String email = System.getProperty("e2e.email", System.getenv("E2E_EMAIL"));
        String password = System.getProperty("e2e.password", System.getenv("E2E_PASSWORD"));

        assumeTrue(email != null && !email.isBlank() && password != null && !password.isBlank(),
                "Provide E2E_EMAIL and E2E_PASSWORD to run the login flow");

        open("/login");
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[placeholder='Email']"))).sendKeys(email);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector("input[placeholder='Password']"))).sendKeys(password);
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//button[normalize-space()='Login']"))).click();

        wait.until(currentDriver -> {
            String url = currentDriver.getCurrentUrl();
            return url.contains("/shop") || url.contains("/vendor") || url.contains("/admin");
        });
    }

    private static WebDriver createDriver() {
        String browser = System.getProperty("selenium.browser", "chrome");

        if ("edge".equalsIgnoreCase(browser)) {
            EdgeOptions options = new EdgeOptions();
            applyCommonOptions(options, HEADLESS);
            return new EdgeDriver(options);
        }

        ChromeOptions options = new ChromeOptions();
        applyCommonOptions(options, HEADLESS);
        return new ChromeDriver(options);
    }

    private static void applyCommonOptions(org.openqa.selenium.MutableCapabilities options, boolean headless) {
        if (options instanceof ChromeOptions chromeOptions) {
            if (headless) {
                chromeOptions.addArguments("--headless=new");
            }
            chromeOptions.addArguments("--window-size=1600,1200", "--no-sandbox", "--disable-dev-shm-usage");
        } else if (options instanceof EdgeOptions edgeOptions) {
            if (headless) {
                edgeOptions.addArguments("--headless=new");
            }
            edgeOptions.addArguments("--window-size=1600,1200", "--no-sandbox", "--disable-dev-shm-usage");
        }
    }

    private void open(String path) {
        driver.get(FRONTEND_BASE_URL + path);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("body")));
    }

    private void assertContainsText(String text) {
        wait.until(currentDriver -> currentDriver.findElement(By.tagName("body")).getText().contains(text));
        assertTrue(
                driver.findElement(By.tagName("body")).getText().contains(text),
                "Expected page to contain: " + text
        );
    }

    private static void waitForFrontend() {
        HttpClient client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(4))
                .build();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(FRONTEND_BASE_URL + "/"))
                .timeout(Duration.ofSeconds(4))
                .GET()
                .build();

        Instant deadline = Instant.now().plus(FRONTEND_WAIT_TIMEOUT);

        while (Instant.now().isBefore(deadline)) {
            try {
                HttpResponse<Void> response = client.send(request, HttpResponse.BodyHandlers.discarding());
                if (response.statusCode() < 500) {
                    return;
                }
            } catch (Exception ignored) {
                // Keep retrying until timeout.
            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException interruptedException) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        throw new IllegalStateException(
                "Frontend is not reachable at " + FRONTEND_BASE_URL
                        + " . Start the frontend app before running Selenium tests."
        );
    }
}
