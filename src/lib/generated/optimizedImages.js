import image0_avif_480 from "../../content/projects/optimized/capd-application-meeting-480.avif?url";
import image0_avif_768 from "../../content/projects/optimized/capd-application-meeting-768.avif?url";
import image0_avif_1200 from "../../content/projects/optimized/capd-application-meeting-1200.avif?url";
import image0_webp_480 from "../../content/projects/optimized/capd-application-meeting-480.webp?url";
import image0_webp_768 from "../../content/projects/optimized/capd-application-meeting-768.webp?url";
import image0_webp_1200 from "../../content/projects/optimized/capd-application-meeting-1200.webp?url";
import image1_avif_448 from "../../content/projects/optimized/capd-mobile-application-448.avif?url";
import image1_webp_448 from "../../content/projects/optimized/capd-mobile-application-448.webp?url";
import image2_avif_480 from "../../content/projects/optimized/inilhoits-24-480.avif?url";
import image2_avif_768 from "../../content/projects/optimized/inilhoits-24-768.avif?url";
import image2_webp_480 from "../../content/projects/optimized/inilhoits-24-480.webp?url";
import image2_webp_768 from "../../content/projects/optimized/inilhoits-24-768.webp?url";
import image3_avif_480 from "../../content/projects/optimized/its-erp-crm-scm-overview-480.avif?url";
import image3_avif_768 from "../../content/projects/optimized/its-erp-crm-scm-overview-768.avif?url";
import image3_avif_1200 from "../../content/projects/optimized/its-erp-crm-scm-overview-1200.avif?url";
import image3_webp_480 from "../../content/projects/optimized/its-erp-crm-scm-overview-480.webp?url";
import image3_webp_768 from "../../content/projects/optimized/its-erp-crm-scm-overview-768.webp?url";
import image3_webp_1200 from "../../content/projects/optimized/its-erp-crm-scm-overview-1200.webp?url";
import image4_avif_480 from "../../content/projects/optimized/sai-simulations-validation-dashboard-480.avif?url";
import image4_avif_768 from "../../content/projects/optimized/sai-simulations-validation-dashboard-768.avif?url";
import image4_avif_1200 from "../../content/projects/optimized/sai-simulations-validation-dashboard-1200.avif?url";
import image4_webp_480 from "../../content/projects/optimized/sai-simulations-validation-dashboard-480.webp?url";
import image4_webp_768 from "../../content/projects/optimized/sai-simulations-validation-dashboard-768.webp?url";
import image4_webp_1200 from "../../content/projects/optimized/sai-simulations-validation-dashboard-1200.webp?url";
import image5_avif_480 from "../../content/projects/optimized/ukex-its-24-480.avif?url";
import image5_avif_768 from "../../content/projects/optimized/ukex-its-24-768.avif?url";
import image5_avif_1200 from "../../content/projects/optimized/ukex-its-24-1200.avif?url";
import image5_webp_480 from "../../content/projects/optimized/ukex-its-24-480.webp?url";
import image5_webp_768 from "../../content/projects/optimized/ukex-its-24-768.webp?url";
import image5_webp_1200 from "../../content/projects/optimized/ukex-its-24-1200.webp?url";

export const optimizedImages = {
  "../content/projects/capd-application-meeting.jpg": {
    src: image0_webp_480,
    width: 4000,
    height: 3000,
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
      { type: "image/avif", srcset: `${image0_avif_480} 480w, ${image0_avif_768} 768w, ${image0_avif_1200} 1200w` },
      { type: "image/webp", srcset: `${image0_webp_480} 480w, ${image0_webp_768} 768w, ${image0_webp_1200} 1200w` }
    ]
  },
  "../content/projects/capd-mobile-application.png": {
    src: image1_webp_448,
    width: 448,
    height: 796,
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
      { type: "image/avif", srcset: `${image1_avif_448} 448w` },
      { type: "image/webp", srcset: `${image1_webp_448} 448w` }
    ]
  },
  "../content/projects/inilhoits-24.png": {
    src: image2_webp_480,
    width: 952,
    height: 457,
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
      { type: "image/avif", srcset: `${image2_avif_480} 480w, ${image2_avif_768} 768w` },
      { type: "image/webp", srcset: `${image2_webp_480} 480w, ${image2_webp_768} 768w` }
    ]
  },
  "../content/projects/its-erp-crm-scm-overview.jpg": {
    src: image3_webp_480,
    width: 1200,
    height: 1600,
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
      { type: "image/avif", srcset: `${image3_avif_480} 480w, ${image3_avif_768} 768w, ${image3_avif_1200} 1200w` },
      { type: "image/webp", srcset: `${image3_webp_480} 480w, ${image3_webp_768} 768w, ${image3_webp_1200} 1200w` }
    ]
  },
  "../content/projects/sai-simulations-validation-dashboard.png": {
    src: image4_webp_480,
    width: 1919,
    height: 1079,
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
      { type: "image/avif", srcset: `${image4_avif_480} 480w, ${image4_avif_768} 768w, ${image4_avif_1200} 1200w` },
      { type: "image/webp", srcset: `${image4_webp_480} 480w, ${image4_webp_768} 768w, ${image4_webp_1200} 1200w` }
    ]
  },
  "../content/projects/ukex-its-24.png": {
    src: image5_webp_480,
    width: 1919,
    height: 965,
    sizes: "(min-width: 900px) 760px, calc(100vw - 32px)",
    sources: [
      { type: "image/avif", srcset: `${image5_avif_480} 480w, ${image5_avif_768} 768w, ${image5_avif_1200} 1200w` },
      { type: "image/webp", srcset: `${image5_webp_480} 480w, ${image5_webp_768} 768w, ${image5_webp_1200} 1200w` }
    ]
  }
};
