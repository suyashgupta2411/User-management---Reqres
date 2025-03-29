import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { updateUser } from "../redux/userSlice";
import { AppDispatch } from "../redux/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Import custom glass styles
import "../styles/glassStyles.css";

const EditUserPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user data is passed through navigation state
    const userState = location.state?.user;
    if (userState) {
      setFirstName(userState.first_name);
      setLastName(userState.last_name);
      setEmail(userState.email);
      setAvatar(userState.avatar);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resultAction = await dispatch(
        updateUser({
          id: Number(id),
          userData: {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        })
      );

      if (updateUser.fulfilled.match(resultAction)) {
        toast.success("User details have been successfully updated.");
        navigate("/users"); // Rely on Redux state update
      } else {
        toast.error("Unable to update user details.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - same as UserListPage */}
      <header className="text-white py-4 px-6">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Edit User</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 max-w-7xl">
        <Dialog open onOpenChange={() => navigate("/users")}>
          <DialogContent className="sm:max-w-md glass-dialog border border-white/20 shadow-xl backdrop-blur-md">
            <DialogHeader>
              <DialogTitle className="font-geist-mono text-white">
                Edit User
              </DialogTitle>
              <DialogDescription className="text-white/70">
                Update user details
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex justify-center mb-4">
                <Avatar className="w-24 h-24 ring-2 ring-white/20">
                  <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} />
                  <AvatarFallback className="bg-white/10 text-white text-2xl">
                    {firstName[0]}
                    {lastName[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div>
                <label htmlFor="firstName" className="block mb-2 text-white/80">
                  First Name
                </label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="glass-input text-white"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block mb-2 text-white/80">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="glass-input text-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="block mb-2 text-white/80">
                  Email
                </label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-input text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/users")}
                  className="glass-button text-white border-white/20 hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="glass-button-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </main>

      {/* Notification component would go here if needed */}
    </div>
  );
};

export default EditUserPage;
