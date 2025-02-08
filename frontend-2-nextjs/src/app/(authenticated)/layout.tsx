import { getAuthToken, getLogin } from "@/services/BackendService";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserData } from "./edit-profile/data";

export default async function AuthenticatedLayoutWithSidebar(
  props: RootLayoutProps
) {
  const authToken = await getAuthToken();
  const userLogin = await getLogin(authToken);
  if (!userLogin) {
    redirect("/login");
  }

  // const userData = await getUserData(userLogin);
  const userData = { firstName: "John", lastName: "Doe", email: "johndoe@gmail.com" }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
        }}
      />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
