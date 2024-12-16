// import React, { useContext } from "react";
// import { ThemeContext } from "../../context/ThemeContext";
// import Sidebar from "./Sidebar";
// import Navbar from "./Navbar";
// import "../../App.css";

// const Layout = ({ children }) => {
//   const { isDarkMode } = useContext(ThemeContext);

//   return (
//     <div
//       className="flex flex-col h-screen bg-primary-50 p-10"
//       style={{
//         backgroundImage: 'url("/main_bg.jpg")',
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         backgroundRepeat: "no-repeat",
//       }}
//     >
//       <div
//         className="flex justify-between justify-items-center p-4 w-full h-full"
//         style={{
//           background: isDarkMode
//             ? "rgba(103, 94, 94, 0.46)"
//             : "rgba(255, 255, 255, 0.36)",
//           borderRadius: "16px",
//           boxShadow: "0 4px 30px rgba(0, 0, 0, 0.6)",
//           backdropFilter: "blur(9px)",
//           WebkitBackdropFilter: "blur(9px)",
//           border: isDarkMode
//             ? "3px solid rgba(103, 94, 94, 1)"
//             : "3px solid rgba(255, 255, 255, 1)",
//         }}
//       >
//         <aside
//           className={`bg-neutral-100 dark:bg-neutral-800 shadow-lg transition-all duration-300 h-full w-1/6 left-5 overflow-y-auto p-4 rounded-lg border ${
//             isDarkMode ? "border-neutral-800" : "border-neutral-100"
//           }`}
//         >
//           <Sidebar />
//         </aside>

//         <div className="w-10/12 ml-5 h-full">
//           <header className="w-12/12">
//             <Navbar />
//           </header>

//           <main
//             className={`w-12/12 fixed overflow-y-auto p-6 rounded-lg`}
//             style={{
//               width: "81%",
//               height: "89%",
//               scrollbarWidth: "thin",
//             }}
//           >
//             {children}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import React, { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../../App.css";

const Layout = ({ children }) => {
  const { isDarkMode } = useContext(ThemeContext);

  return (
    <div
      className="flex flex-col h-screen bg-primary-50 p-10"
      style={{
        backgroundImage: 'url("/main_bg.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="flex justify-between justify-items-center p-4 w-full h-full gap-3"
        style={{
          background: isDarkMode
            ? "rgba(103, 94, 94, 0.46)"
            : "rgba(255, 255, 255, 0.36)",
          borderRadius: "16px",
          boxShadow: "0 4px 30px rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(9px)",
          WebkitBackdropFilter: "blur(9px)",
          border: isDarkMode
            ? "3px solid rgba(103, 94, 94, 1)"
            : "3px solid rgba(255, 255, 255, 1)",
        }}
      >
        <div
          className={`bg-neutral-100 dark:bg-neutral-800 shadow-lg transition-all duration-300 h-full w-1/6 left-5 overflow-y-auto p-4 rounded-lg border ${
            isDarkMode ? "border-neutral-800" : "border-neutral-100"
          }`}
        >
          <Sidebar />
        </div>

        <div
          className={`bg-neutral-100 dark:bg-neutral-800 shadow-lg transition-all duration-300 h-full w-5/6 right-5 overflow-y-auto p-6 rounded-lg border ${
            isDarkMode ? "border-neutral-800" : "border-neutral-100"
          }`}
        >
          <header className="w-12/12">
            <Navbar />
          </header>

          <div
            className="w-12/12 relative overflow-y-auto rounded-lg"
            style={{
              scrollbarWidth: "thin",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
