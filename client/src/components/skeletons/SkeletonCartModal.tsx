import React from "react";
import ContentLoader from "react-content-loader";

const SkeletonCartModal = () => {
  return (
    <div
      data-testid="Skeleton-cart-modal"
      className="p-3  flex flex-col max-h-[70%]  gap-2 "
    >
      <ContentLoader
        rtl
        speed={2}
        width={390}
        height={500}
        viewBox="0 0 390 500"
        backgroundColor="#dfdada"
        foregroundColor="#ecebeb"
      >
        <rect x="0" y="1" rx="0" ry="0" width="438" height="114" />
        <rect x="0" y="129" rx="0" ry="0" width="438" height="114" />
        <rect x="0" y="258" rx="0" ry="0" width="438" height="114" />
      </ContentLoader>
      <div className=" absolute bottom-1">
        {" "}
        <ContentLoader
          rtl
          speed={2}
          width={390}
          height={150}
          viewBox="0 0 390 150"
          backgroundColor="#dfdada"
          foregroundColor="#ecebeb"
        >
          <rect x="0" y="75" rx="0" ry="0" width="482" height="71" />
          <rect x="0" y="37" rx="0" ry="0" width="118" height="29" />
          <rect x="322" y="37" rx="0" ry="0" width="118" height="29" />
        </ContentLoader>
      </div>
    </div>
  );
};

export default SkeletonCartModal;
