import ProfileLayout from "./ProfileLayout";
import ChangePasswordForm from "../components/ChangePasswordForm";

export default function ChangePasswordPage() {
  return (
    <ProfileLayout>
      <ChangePasswordForm redirectPath="/account-profile" />
    </ProfileLayout>
  );
}
