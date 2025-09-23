import React from "react";
import ContentLoader from "react-content-loader";

const SkeletonUpdateProduct = () => {
  return (
    <ContentLoader
      rtl
      speed={2}
      width={675}
      height={680}
      viewBox="0 0 675 680"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="10" ry="10" width="675" height="72" />
      <rect x="0" y="82" rx="10" ry="10" width="675" height="72" />
      <rect x="0" y="166" rx="10" ry="10" width="675" height="80" />
      <rect x="0" y="260" rx="10" ry="10" width="675" height="72" />
      <rect x="276" y="344" rx="10" ry="10" width="408" height="57" />
      <rect x="276" y="413" rx="10" ry="10" width="408" height="57" />
      <rect x="0" y="344" rx="10" ry="10" width="264" height="126" />
      <rect x="0" y="482" rx="10" ry="10" width="675" height="60" />
      <rect x="0" y="555" rx="18" ry="18" width="675" height="44" />
    </ContentLoader>
  );
};

export default SkeletonUpdateProduct;
