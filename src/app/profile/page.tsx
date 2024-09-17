"use client";

import { ProfileSection } from "@/components/profile-page/Profile";
import { client } from "@/consts/client";
import { useEffect } from "react";
import { useActiveAccount, useConnectModal } from "thirdweb/react";

export default function ProfilePage() {
  const account = useActiveAccount();
  const { connect } = useConnectModal();

  useEffect(() => {
    if (!account) {
      connect({ client });
    }
  }, [account, connect]);

  if (!account)
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <h1 style={{ margin: "auto" }}>Log in to continue</h1>
      </div>
    );

  return <ProfileSection address={account.address} />;
}
