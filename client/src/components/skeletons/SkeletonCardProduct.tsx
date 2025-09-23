import ContentLoader from "react-content-loader";

const SkeletonCardProduct = () => {
  return (
    <div>
      <h1 className="text-[36px] font-semibold my-8">
        <ContentLoader
          rtl
          speed={2}
          width={150}
          height={54}
          viewBox="0 0 150 54"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect x="267" y="347" rx="0" ry="0" width="0" height="3" />
          <rect x="25" y="360" rx="0" ry="0" width="1" height="9" />
          <rect x="105" y="36" rx="0" ry="0" width="258" height="0" />
          <rect x="380" y="17" rx="0" ry="0" width="117" height="23" />
          <rect x="2" y="0" rx="0" ry="0" width="341" height="146" />
        </ContentLoader>
      </h1>
      <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-10 gap-x-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            {" "}
            <ContentLoader
              rtl
              speed={2}
              width={255}
              height={320}
              viewBox="0 0 255 320"
              backgroundColor="#f3f3f3"
              foregroundColor="#ecebeb"
            >
              <rect x="267" y="347" rx="0" ry="0" width="0" height="3" />
              <rect x="25" y="360" rx="0" ry="0" width="1" height="9" />
              <rect x="105" y="36" rx="0" ry="0" width="258" height="0" />
              <rect x="380" y="17" rx="0" ry="0" width="117" height="23" />
              <circle cx="130" cy="123" r="123" />
              <rect x="0" y="254" rx="0" ry="0" width="286" height="14" />
              <rect x="0" y="276" rx="0" ry="0" width="286" height="14" />
              <rect x="0" y="296" rx="0" ry="0" width="91" height="43" />
              <rect x="130" y="297" rx="0" ry="0" width="122" height="31" />
            </ContentLoader>
          </div>
          //   <ContentLoader
          //     rtl
          //     speed={2}
          //     width={272}
          //     height={500}
          //     viewBox="0 0 272 500"
          //     backgroundColor="#f3f3f3"
          //     foregroundColor="#ecebeb"
          //   >
          //     <circle cx="131" cy="131" r="131" />
          //     <rect x="2" y="290" rx="0" ry="0" width="272" height="30" />
          //     <rect x="0" y="337" rx="6" ry="6" width="272" height="9" />
          //     <rect x="267" y="347" rx="0" ry="0" width="0" height="3" />
          //     <rect x="0" y="354" rx="6" ry="6" width="272" height="9" />
          //     <rect x="25" y="360" rx="0" ry="0" width="1" height="9" />
          //     <rect x="0" y="369" rx="6" ry="6" width="272" height="9" />
          //     <rect x="0" y="384" rx="6" ry="6" width="272" height="9" />
          //     <rect x="151" y="404" rx="12" ry="12" width="117" height="44" />
          //     <rect x="0" y="420" rx="0" ry="0" width="61" height="24" />
          //   </ContentLoader>
        ))}
      </div>
    </div>
  );
};

export default SkeletonCardProduct;
