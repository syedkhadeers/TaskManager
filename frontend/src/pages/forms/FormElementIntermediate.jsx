// import React, { useContext } from "react";
// import { ThemeContext } from "../../context/ThemeContext";
// import Layout from "../../components/layout/Layout";
// import DateInput from "../../components/common/formElements/intermediate/DateInput";
// import DropInput from "../../components/common/formElements/intermediate/FixedCropAspect";
// import FixedCropAspect from "../../components/common/formElements/intermediate/FixedCropAspect";
// import CustomCropAspect from "../../components/common/formElements/intermediate/CustomCropAspect";
// import CustomCropAspectMultiple from "../../components/common/formElements/intermediate/CustomCropAspectMultiple";


// const FormElementIntermediate = () => {
//   const { isDarkMode } = useContext(ThemeContext);
//   return (
//     <Layout>
//       <div className="flex items-center justify-center w-full flex-col overflow-y-auto container mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  3xl:grid-cols-6 gap-5 p-3 ">
//           <div className="flex items-center justify-center h-fit w-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-hidden text-gray-700 dark:text-gray-300">
//             <div className="w-full p-0">
//               <h1 className="text-xl font-bold border-b-2 border-b-slate-400 ">
//                 Date Input
//               </h1>
//               <div className="mt-4 ">
//                 <DateInput />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-center h-fit w-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-hidden text-gray-700 dark:text-gray-300">
//             <div className="w-full p-0">
//               <h1 className="text-xl font-bold border-b-2 border-b-slate-400 ">
//                 File Drag & Drop
//               </h1>
//               <div className="mt-4 ">
//                 <FixedCropAspect />
//                 <CustomCropAspect />
//                 <CustomCropAspectMultiple />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default FormElementIntermediate;

import React from 'react'

const FormElementIntermediate = () => {
  return (
    <div>FormElementIntermediate</div>
  )
}

export default FormElementIntermediate