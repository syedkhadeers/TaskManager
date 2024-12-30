// import React, { useContext } from "react";
// import { ThemeContext } from "../../../../context/ThemeContext";
// import {
//   DollarSign,
//   Tag,
//   CheckCircle,
//   XCircle,
//   XIcon,
// } from "lucide-react";
// import Avatar from "react-avatar";

// const ViewExtraServicesContent = ({ service, onClose }) => {
//   const { isDarkMode } = useContext(ThemeContext);

//   return (
//     <div className="h-full w-full">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex justify-between items-center">
//         <h2 className="text-xl font-semibold text-white">View Extra Service</h2>
//         <button
//           onClick={onClose}
//           className="text-white hover:text-gray-200 transition-colors"
//         >
//           <XIcon size={24} />
//         </button>
//       </div>

//       {/* Content */}
//       <div className="p-6 space-y-6">
//         <div className="flex flex-col items-center gap-6 mb-8">
//           <Avatar
//             name={service?.serviceName}
//             src={
//               typeof service?.image === "string"
//                 ? service.image
//                 : service.image?.url
//             }
//             size="120"
//             round
//             className="border-4 border-gray-200 dark:border-gray-700"
//           />
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//             {service?.serviceName}
//           </h1>
//         </div>

//         <div className="grid grid-cols-1 gap-6">
//           <InfoCard
//             icon={<DollarSign className="h-6 w-6" />}
//             title="Price"
//             value={`$${service?.price?.toFixed(2)}`}
//           />
//           <InfoCard
//             icon={<Tag className="h-6 w-6" />}
//             title="Category"
//             value={service?.category}
//           />
//           <InfoCard
//             icon={
//               service?.availability ? (
//                 <CheckCircle className="h-6 w-6" />
//               ) : (
//                 <XCircle className="h-6 w-6" />
//               )
//             }
//             title="Availability"
//             value={
//               <span
//                 className={`px-3 py-1 text-xs font-medium rounded-full ${
//                   service?.availability
//                     ? "bg-green-100 text-green-800"
//                     : "bg-red-100 text-red-800"
//                 }`}
//               >
//                 {service?.availability ? "Available" : "Unavailable"}
//               </span>
//             }
//           />
//           <InfoCard
//             icon={<Tag className="h-6 w-6" />}
//             title="Description"
//             value={service?.description}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// const InfoCard = ({ icon, title, value }) => (
//   <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-start space-x-4">
//     <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">{icon}</div>
//     <div>
//       <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
//         {title}
//       </h3>
//       <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
//         {value}
//       </div>
//     </div>
//   </div>
// );

// export default ViewExtraServicesContent;
import React from 'react'

const ViewExtraServicesContent = () => {
  return (
    <div>ViewExtraServicesContent</div>
  )
}

export default ViewExtraServicesContent