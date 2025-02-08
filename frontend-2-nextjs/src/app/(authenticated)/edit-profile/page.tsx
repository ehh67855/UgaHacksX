import { Suspense } from "react";
import { getAuthToken, getLogin } from "@/services/BackendService";
import { EditProfileForm } from "./edit-profile-form";
import { getUserData } from "./data";

export default async function EditProfilePage() {
  const token = await getAuthToken();
  const userLogin = await getLogin(token);

  if (!userLogin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <p className="text-muted-foreground">
          Please log in to edit your profile.
        </p>
      </div>
    );
  }

  const userData = await getUserData(userLogin);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Edit Profile</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <EditProfileForm initialData={userData} userLogin={userLogin} />
      </Suspense>
    </div>
  );
}
