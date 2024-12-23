import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  Search,
  Eye,
  Mail,
  Phone,
  Calendar,
  Shield,
  MapPin,
  Edit2,
  Trash2,
} from "lucide-react";
import Avatar from "react-avatar";
import { getOtherUser, deleteUser } from "../../services/userServices";
import EditUsersContent from "./EditUsersContent";
import DeleteModal from "../common/modal/DeleteModal";
import { toast } from "react-toastify";

const ViewUserContent = () => {
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    totalRooms: 0,
    totalGuests: 0,
  });

  const fetchUser = async () => {
    try {
      const userData = await getOtherUser(id);
      setUser(userData);
      // Mock statistics - replace with actual API calls
      setStats({
        totalBookings: 25,
        totalRevenue: 5000,
        totalRooms: 10,
        totalGuests: 45,
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(id);
      toast.success("User deleted successfully");
      navigate("/users");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const bookings = [
    {
      id: 1,
      roomNumber: "101",
      checkIn: "2024-02-15",
      checkOut: "2024-02-20",
      status: "Confirmed",
      amount: 500,
    },
    {
      id: 2,
      roomNumber: "205",
      checkIn: "2024-03-01",
      checkOut: "2024-03-05",
      status: "Pending",
      amount: 750,
    },
  ];

  const logs = [
    {
      id: 1,
      action: "Profile Updated",
      details: "Changed profile picture and contact information",
      timestamp: "2024-01-15 10:30 AM",
      type: "update",
    },
    {
      id: 2,
      action: "Room Booked",
      details: "Booked Room 101 for 5 nights",
      timestamp: "2024-01-14 03:45 PM",
      type: "booking",
    },
    {
      id: 3,
      action: "Payment Processed",
      details: "Processed payment of $500",
      timestamp: "2024-01-13 11:20 AM",
      type: "payment",
    },
    {
      id: 4,
      action: "Check-in Completed",
      details: "Checked in to Room 101",
      timestamp: "2024-01-12 02:15 PM",
      type: "check-in",
    },
  ];

  const SearchBar = () => (
    <div className="mb-4 relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
      />
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <button
        onClick={() => navigate("/users")}
        className="group mb-4 flex items-center text-gray-600 hover:text-blue-600 transition-colors"
      >
        <ArrowLeftIcon className="mr-2 h-4 w-4" />
        <span className="text-sm font-medium">Back to Users</span>
      </button>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          color="bg-green-500"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Guests"
          value={stats.totalGuests}
          color="bg-orange-500"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <Avatar
              name={user?.name}
              src={user?.photo?.url}
              size="120"
              round
              className="border-4 border-white/30"
            />
            <div className="text-center md:text-left text-white">
              <h1 className="text-2xl font-bold mb-1">{user?.name}</h1>
              <p className="text-blue-100">{user?.email}</p>
              <div className="flex gap-2 mt-2">
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {user?.role}
                </span>
                <span className="px-3 py-1 rounded-full text-xs bg-white/20">
                  {user?.isVerified ? "✓ Verified" : "Pending Verification"}
                </span>
              </div>
            </div>
          </div>

          {/* Edit and Delete Buttons */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleEdit}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Edit2 size={16} />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500/20 hover:bg-red-500/30 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {["Bookings", "Logs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase())}
                className={`px-4 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.toLowerCase()
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-4">
          <SearchBar />

          {activeTab === "bookings" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left">Room</th>
                    <th className="px-4 py-3 text-left">Check In</th>
                    <th className="px-4 py-3 text-left">Check Out</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(
                      (booking) =>
                        booking.roomNumber
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        booking.status
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                    )
                    .map((booking) => (
                      <tr key={booking.id} className="border-t">
                        <td className="px-4 py-3">{booking.roomNumber}</td>
                        <td className="px-4 py-3">{booking.checkIn}</td>
                        <td className="px-4 py-3">{booking.checkOut}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              booking.status === "Confirmed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">${booking.amount}</td>
                        <td className="px-4 py-3">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="space-y-4">
              {logs
                .filter(
                  (log) =>
                    log.action
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    log.details
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )
                .map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {log.action}
                      </h4>
                      <p className="text-sm text-gray-600">{log.details}</p>
                      <span className="text-xs text-gray-500">
                        {log.timestamp}
                      </span>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        {
                          update: "bg-blue-100 text-blue-800",
                          booking: "bg-green-100 text-green-800",
                          payment: "bg-purple-100 text-purple-800",
                          "check-in": "bg-yellow-100 text-yellow-800",
                        }[log.type]
                      }`}
                    >
                      {log.type}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md overflow-y-auto">
            <EditUsersContent
              user={user}
              onClose={() => setShowEditModal(false)}
              onUserUpdated={() => {
                setShowEditModal(false);
                fetchUser();
              }}
            />
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <DeleteModal
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

const StatCard = ({ title, value, color }) => (
  <div className={`${color} rounded-lg p-4 text-white`}>
    <h3 className="text-sm font-medium opacity-80">{title}</h3>
    <p className="text-2xl font-bold mt-1">{value}</p>
  </div>
);

export default ViewUserContent;
