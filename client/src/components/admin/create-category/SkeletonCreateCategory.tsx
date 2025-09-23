import React from "react";
import ContentLoader from "react-content-loader";

const SkeletonCreateCategory = () => {
  return (
    <ContentLoader
      rtl
      speed={2}
      width="100%"
      height={50}
      viewBox="0 0 763 50"
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
    >
      <rect x="267" y="347" rx="0" ry="0" width="0" height="3" />
      <rect x="25" y="360" rx="0" ry="0" width="1" height="9" />
      <rect x="105" y="36" rx="0" ry="0" width="258" height="0" />
      <rect x="0" y="0" rx="0" ry="0" width="150" height="25" />
      <rect x="162" y="15" rx="0" ry="0" width="490" height="10" />
      <rect x="663" y="0" rx="0" ry="0" width="100" height="25" />
    </ContentLoader>
  );
};

export default SkeletonCreateCategory;
