// import React, { useContext } from "react";
// import { ThemeContext } from "../../context/ThemeContext";
// import TextInput from "../../components/common/formElements/basic/TextInput";
// import NumberInput from "../../components/common/formElements/basic/NumberInput";
// import SelectInput from "../../components/common/formElements/basic/SelectInput";
// import CheckboxVInput from "../../components/common/formElements/basic/CheckboxVInput";
// import CheckboxInput from "../../components/common/formElements/basic/CheckboxInput";
// import RadioButtonInput from "../../components/common/formElements/basic/RadioButtonInput";
// import RadioButtonVInput from "../../components/common/formElements/basic/RadioButtonVInput";
// import SwitchButtonInput from "../../components/common/formElements/basic/SwitchButtonInput";
// import Layout from "../../components/layout/Layout";

// const FormElementBasic = () => {
//   const { isDarkMode } = useContext(ThemeContext);
//   return (
//     <Layout>
//       <div className="flex items-center justify-center w-full flex-col overflow-y-auto container mx-auto">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3  3xl:grid-cols-6 gap-5 p-3 ">
//           <div className="flex items-center justify-center h-fit w-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-hidden text-gray-700 dark:text-gray-300">
//             <div>
//               <h1 className="text-xl font-bold border-b-2 border-b-slate-400 ">
//                 Text Input
//               </h1>
//               <div className="mt-4 ">
//                 <TextInput />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-center h-fit w-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-hidden text-gray-700 dark:text-gray-300">
//             <div>
//               <h1 className="text-xl font-bold border-b-2 border-b-slate-400 ">
//                 Number Input
//               </h1>
//               <div className="mt-4">
//                 <NumberInput />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-center h-fit w-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-hidden text-gray-700 dark:text-gray-300">
//             <div className="w-full p-0">
//               <h1 className="text-xl font-bold border-b-2 border-b-slate-400 ">
//                 Select Input
//               </h1>
//               <div className="mt-4 ">
//                 <SelectInput />
//               </div>
//             </div>
//           </div>
//           <div className="flex items-center justify-center h-fit w-full bg-white dark:bg-gray-800 rounded-lg p-6 overflow-hidden text-gray-700 dark:text-gray-300 ">
//             <div className="w-full p-0">
//               <h1 className="text-xl font-bold border-b-2 border-b-slate-400 mb-4">
//                 Select Input
//               </h1>
//               <div className="">
//                 <CheckboxVInput />
//                 <CheckboxInput />
//                 <RadioButtonInput />
//                 <RadioButtonVInput />
//                 <SwitchButtonInput />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default FormElementBasic;
import React from 'react'

const FormElementBasic = () => {
  return (
    <div>FormElementBasic</div>
  )
}

export default FormElementBasic