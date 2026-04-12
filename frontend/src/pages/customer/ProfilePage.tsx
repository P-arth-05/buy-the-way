import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import {
  createUser,
  getUserByEmail,
  updateUser,
  type UserDTO,
} from "@/lib/userApi";

type ProfileForm = Omit<UserDTO, "id">;

const EMPTY_FORM: ProfileForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  active: true,
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);

  const requiredFieldsMissing = useMemo(() => {
    return (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim() ||
      !form.state.trim() ||
      !form.pincode.trim()
    );
  }, [form]);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user?.email) {
        toast.error("Please login to view your profile.");
        navigate("/login");
        return;
      }

      const email = user.email;
      const fallbackName = (user.user_metadata?.name as string | undefined) ?? "";

      try {
        const response = await getUserByEmail(email);
        const profile = response.data;
        setUserId(profile.id ?? null);
        setForm({
          name: profile.name ?? "",
          email: profile.email ?? email,
          phone: profile.phone ?? "",
          address: profile.address ?? "",
          city: profile.city ?? "",
          state: profile.state ?? "",
          pincode: profile.pincode ?? "",
          active: profile.active ?? true,
        });
      } catch {
        setEditMode(true);
        setForm((prev) => ({
          ...prev,
          name: fallbackName,
          email,
          active: true,
        }));
      } finally {
        setLoading(false);
      }
    };

    void loadProfile();
  }, [navigate]);

  const onChange = (field: keyof ProfileForm, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const onSave = async () => {
    if (!/^\d{10}$/.test(form.phone)) {
      toast.error("Phone must be exactly 10 digits.");
      return;
    }
    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error("Pincode must be exactly 6 digits.");
      return;
    }

    setSaving(true);
    try {
      const payload: UserDTO = {
        ...form,
        email: form.email.trim().toLowerCase(),
      };

      const response = userId
        ? await updateUser(userId, payload)
        : await createUser(payload);

      const saved = response.data;
      setUserId(saved.id ?? null);
      setForm({
        name: saved.name,
        email: saved.email,
        phone: saved.phone,
        address: saved.address,
        city: saved.city,
        state: saved.state,
        pincode: saved.pincode,
        active: saved.active ?? true,
      });
      setEditMode(false);
      toast.success("Your profile was updated.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to save your profile.";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardContent className="p-6">Loading your profile...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>My Profile</CardTitle>
          {!editMode ? (
            <Button onClick={() => setEditMode(true)}>Edit Info</Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-5">
          {!editMode ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Name</p>
                <p className="font-medium">{form.name || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{form.email || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{form.phone || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Pincode</p>
                <p className="font-medium">{form.pincode || "-"}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{form.address || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">City</p>
                <p className="font-medium">{form.city || "-"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">State</p>
                <p className="font-medium">{form.state || "-"}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => onChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email} disabled />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) => onChange("phone", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={form.pincode}
                    inputMode="numeric"
                    maxLength={6}
                    onChange={(e) => onChange("pincode", e.target.value.replace(/\D/g, ""))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => onChange("address", e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) => onChange("city", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={form.state}
                    onChange={(e) => onChange("state", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button onClick={onSave} disabled={saving || requiredFieldsMissing}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditMode(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
