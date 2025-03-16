
import { useState, useEffect } from 'react';
import { 
  Table,
  Button,
  Modal,
  Label,
  TextInput,
  Textarea,
  Spinner,
  Alert
} from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';

// Types
interface Card {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  bizNumber?: number;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
    houseNumber: string;
    zip: string;
  };
  userId: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: {
    first: string;
    last: string;
  };
  email: string;
  isBusiness: boolean;
  isAdmin: boolean;
}

const AdminPage = () => {
  // State
  const [users, setUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'user' | 'card' } | null>(null);
  const [showUserEditModal, setShowUserEditModal] = useState<boolean>(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [showCardEditModal, setShowCardEditModal] = useState<boolean>(false);
  const [cardToEdit, setCardToEdit] = useState<Card | null>(null);

  // API base URL
  const API_BASE_URL = import.meta.env.VITE_USERS_API_BASE_URL as string;
  const token = localStorage.getItem('token');

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch users
        const usersResponse = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        // Fetch cards
        const cardsResponse = await axios.get(`${API_BASE_URL}/cards`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        setUsers(usersResponse.data);
        setCards(cardsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL, token]);

  // Handle user role toggle (admin/business)
  const handleToggleRole = async (userId: string, role: 'admin' | 'business') => {
    try {
      const user = users.find(u => u._id === userId);
      if (!user) return;

      const updatedUser = { 
        ...user, 
        isAdmin: role === 'admin' ? !user.isAdmin : user.isAdmin,
        isBusiness: role === 'business' ? !user.isBusiness : user.isBusiness
      };

      await axios.put(`${API_BASE_URL}/users/${userId}`, updatedUser, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Update local state
      setUsers(users.map(u => u._id === userId ? updatedUser : u));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role. Please try again.');
    }
  };

  // Delete handlers
  const handleDeleteClick = (id: string, type: 'user' | 'card') => {
    setItemToDelete({ id, type });
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    try {
      const { id, type } = itemToDelete;
      const endpoint = type === 'user' ? 'users' : 'cards';
      
      await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      if (type === 'user') {
        setUsers(users.filter(user => user._id !== id));
      } else {
        setCards(cards.filter(card => card._id !== id));
      }
      
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (err) {
      console.error(`Error deleting ${itemToDelete.type}:`, err);
      setError(`Failed to delete ${itemToDelete.type}. Please try again.`);
    }
  };

  // Edit handlers
  const handleEditUser = (user: User) => {
    setUserToEdit(user);
    setShowUserEditModal(true);
  };

  const handleEditCard = (card: Card) => {
    setCardToEdit(card);
    setShowCardEditModal(true);
  };

  const handleSaveUserEdit = async () => {
    if (!userToEdit) return;
    
    try {
      await axios.put(`${API_BASE_URL}/users/${userToEdit._id}`, userToEdit, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setUsers(users.map(u => u._id === userToEdit._id ? userToEdit : u));
      setShowUserEditModal(false);
      setUserToEdit(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('Failed to update user. Please try again.');
    }
  };

  const handleSaveCardEdit = async () => {
    if (!cardToEdit) return;
    
    try {
      await axios.put(`${API_BASE_URL}/cards/${cardToEdit._id}`, cardToEdit, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setCards(cards.map(c => c._id === cardToEdit._id ? cardToEdit : c));
      setShowCardEditModal(false);
      setCardToEdit(null);
    } catch (err) {
      console.error('Error updating card:', err);
      setError('Failed to update card. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="xl" />
        <p className="ml-2">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {error && (
        <Alert color="failure" className="mb-4">
          <span>{error}</span>
        </Alert>
      )}
      
      {/* Users Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Users Management</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Business</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {users.map((user) => (
              <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {user.name.first} {user.name.last}
                </Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <Button 
                    size="xs" 
                    color={user.isBusiness ? "success" : "gray"}
                    onClick={() => handleToggleRole(user._id, 'business')}
                  >
                    {user.isBusiness ? "Yes" : "No"}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <Button 
                    size="xs" 
                    color={user.isAdmin ? "purple" : "gray"}
                    onClick={() => handleToggleRole(user._id, 'admin')}
                  >
                    {user.isAdmin ? "Yes" : "No"}
                  </Button>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex space-x-2">
                    <Button color="info" size="xs" onClick={() => handleEditUser(user)}>
                      Edit
                    </Button>
                    <Button color="failure" size="xs" onClick={() => handleDeleteClick(user._id, 'user')}>
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
      
      {/* Cards Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Cards Management</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Title</Table.HeadCell>
            <Table.HeadCell>Business Number</Table.HeadCell>
            <Table.HeadCell>Owner</Table.HeadCell>
            <Table.HeadCell>Created At</Table.HeadCell>
            <Table.HeadCell>Actions</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {cards.map((card) => {
              const cardOwner = users.find(u => u._id === card.userId);
              
              return (
                <Table.Row key={card._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {card.title}
                  </Table.Cell>
                  <Table.Cell>{card.bizNumber || 'N/A'}</Table.Cell>
                  <Table.Cell>
                    {cardOwner 
                      ? `${cardOwner.name.first} ${cardOwner.name.last}` 
                      : 'Unknown User'}
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(card.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex space-x-2">
                      <Button color="info" size="xs" onClick={() => handleEditCard(card)}>
                        Edit
                      </Button>
                      <Button color="failure" size="xs" onClick={() => handleDeleteClick(card._id, 'card')}>
                        Delete
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
      
      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        size="md"
        popup
        onClose={() => setShowDeleteModal(false)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this {itemToDelete?.type}?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleConfirmDelete}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => setShowDeleteModal(false)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      
      {/* User Edit Modal */}
      <Modal
        show={showUserEditModal}
        onClose={() => setShowUserEditModal(false)}
      >
        <Modal.Header>Edit User</Modal.Header>
        <Modal.Body>
          {userToEdit && (
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="firstName" value="First Name" />
                </div>
                <TextInput
                  id="firstName"
                  value={userToEdit.name.first}
                  onChange={(e) => setUserToEdit({
                    ...userToEdit,
                    name: { ...userToEdit.name, first: e.target.value }
                  })}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="lastName" value="Last Name" />
                </div>
                <TextInput
                  id="lastName"
                  value={userToEdit.name.last}
                  onChange={(e) => setUserToEdit({
                    ...userToEdit,
                    name: { ...userToEdit.name, last: e.target.value }
                  })}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="email" value="Email" />
                </div>
                <TextInput
                  id="email"
                  type="email"
                  value={userToEdit.email}
                  onChange={(e) => setUserToEdit({
                    ...userToEdit,
                    email: e.target.value
                  })}
                  required
                />
              </div>
              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Label htmlFor="isBusiness" className="mr-2">Business User</Label>
                  <input
                    id="isBusiness"
                    type="checkbox"
                    checked={userToEdit.isBusiness}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      isBusiness: e.target.checked
                    })}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex items-center">
                  <Label htmlFor="isAdmin" className="mr-2">Admin User</Label>
                  <input
                    id="isAdmin"
                    type="checkbox"
                    checked={userToEdit.isAdmin}
                    onChange={(e) => setUserToEdit({
                      ...userToEdit,
                      isAdmin: e.target.checked
                    })}
                    className="w-4 h-4"
                  />
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveUserEdit}>Save Changes</Button>
          <Button color="gray" onClick={() => setShowUserEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Card Edit Modal */}
      <Modal
        show={showCardEditModal}
        size="xl"
        onClose={() => setShowCardEditModal(false)}
      >
        <Modal.Header>Edit Card</Modal.Header>
        <Modal.Body>
          {cardToEdit && (
            <div className="space-y-6">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="cardTitle" value="Title" />
                </div>
                <TextInput
                  id="cardTitle"
                  value={cardToEdit.title}
                  onChange={(e) => setCardToEdit({
                    ...cardToEdit,
                    title: e.target.value
                  })}
                  required
                />
              </div>
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="cardDescription" value="Description" />
                </div>
                <Textarea
                  id="cardDescription"
                  value={cardToEdit.description}
                  onChange={(e) => setCardToEdit({
                    ...cardToEdit,
                    description: e.target.value
                  })}
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardImageUrl" value="Image URL" />
                  </div>
                  <TextInput
                    id="cardImageUrl"
                    value={cardToEdit.imageUrl}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      imageUrl: e.target.value
                    })}
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardImageAlt" value="Image Alt Text" />
                  </div>
                  <TextInput
                    id="cardImageAlt"
                    value={cardToEdit.imageAlt}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      imageAlt: e.target.value
                    })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardPhone" value="Phone" />
                  </div>
                  <TextInput
                    id="cardPhone"
                    value={cardToEdit.phone}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      phone: e.target.value
                    })}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardBizNumber" value="Business Number" />
                  </div>
                  <TextInput
                    id="cardBizNumber"
                    type="number"
                    value={cardToEdit.bizNumber || ''}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      bizNumber: parseInt(e.target.value) || undefined
                    })}
                  />
                </div>
              </div>
              <h4 className="font-medium">Address</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardStreet" value="Street" />
                  </div>
                  <TextInput
                    id="cardStreet"
                    value={cardToEdit.address.street}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      address: { ...cardToEdit.address, street: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardHouseNumber" value="House Number" />
                  </div>
                  <TextInput
                    id="cardHouseNumber"
                    value={cardToEdit.address.houseNumber}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      address: { ...cardToEdit.address, houseNumber: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardCity" value="City" />
                  </div>
                  <TextInput
                    id="cardCity"
                    value={cardToEdit.address.city}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      address: { ...cardToEdit.address, city: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardCountry" value="Country" />
                  </div>
                  <TextInput
                    id="cardCountry"
                    value={cardToEdit.address.country}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      address: { ...cardToEdit.address, country: e.target.value }
                    })}
                    required
                  />
                </div>
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="cardZip" value="Zip Code" />
                  </div>
                  <TextInput
                    id="cardZip"
                    value={cardToEdit.address.zip}
                    onChange={(e) => setCardToEdit({
                      ...cardToEdit,
                      address: { ...cardToEdit.address, zip: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleSaveCardEdit}>Save Changes</Button>
          <Button color="gray" onClick={() => setShowCardEditModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPage;