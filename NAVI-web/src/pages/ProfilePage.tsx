import { ProfileCard, SecurityCard, useSession } from "../features/profile";

export default function ProfilePage() {
  const { profile, updateProfile } = useSession();

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
        <p className="text-xs text-slate-400 mt-0.5">Tu información personal y de acceso</p>
      </div>

      <ProfileCard
        profile={profile}
        onSave={(updated) => {
          updateProfile(updated);
          alert("Perfil actualizado");
        }}
      />

      <SecurityCard />
    </div>
  );
}
