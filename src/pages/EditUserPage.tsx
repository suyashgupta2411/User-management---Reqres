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
    <Dialog open onOpenChange={() => navigate("/users")}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-geist-mono">Edit User</DialogTitle>
          <DialogDescription>Update user details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt={`${firstName} ${lastName}`} />
              <AvatarFallback>
                {firstName[0]}
                {lastName[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <label htmlFor="firstName" className="block mb-2">
              First Name
            </label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block mb-2">
              Last Name
            </label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/users")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                "Update User"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserPage;
