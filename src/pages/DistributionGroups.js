import React from "react";
import AliasManager from "../components/AliasManager";

const DistributionGroups = () => {
  return (
    <div className="container py-5">
      <h2>Distribution Group Manager</h2>
      <p>Manage internal email distribution groups efficiently.</p>
      <AliasManager />
    </div>
  );
};

export default DistributionGroups;
