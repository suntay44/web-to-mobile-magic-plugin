export default async function ProfilePage() {
  const response = await fetch("https://api.example.com/profile");
  const profile = await response.json();

  return <main>{profile.name}</main>;
}
