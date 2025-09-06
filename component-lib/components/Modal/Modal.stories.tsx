import type { Meta, StoryObj } from '@storybook/react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { useState } from 'react';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'full'],
    },
    isDarkMode: {
      control: 'boolean',
    },
    closeOnOverlayClick: {
      control: 'boolean',
    },
    closeOnEscapeKey: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Open Modal
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="Default Modal"
        >
          <p>This is a simple modal with default settings.</p>
          <p>Click the X button, press Escape, or click outside to close.</p>
        </Modal>
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const [openModal, setOpenModal] = useState<string | null>(null);
    
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;
    
    return (
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {sizes.map((size) => (
          <button 
            key={size}
            onClick={() => setOpenModal(size)}
            style={{ padding: '8px 16px', cursor: 'pointer', textTransform: 'uppercase' }}
          >
            {size} Modal
          </button>
        ))}
        
        {sizes.map((size) => (
          <Modal
            key={size}
            isOpen={openModal === size}
            onClose={() => setOpenModal(null)}
            title={`${size.toUpperCase()} Modal`}
            size={size}
          >
            <p>This is a {size} sized modal.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </Modal>
        ))}
      </div>
    );
  },
};

export const WithCustomStructure: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Open Custom Modal
        </button>
        
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalHeader onClose={() => setIsOpen(false)}>
            🚀 Custom Modal Header
          </ModalHeader>
          
          <ModalBody>
            <h3>Welcome to our platform!</h3>
            <p>This modal uses custom components for better control over the layout and styling.</p>
            <div style={{ 
              padding: '1rem', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '6px',
              border: '1px solid #bae6fd',
              marginTop: '1rem'
            }}>
              <strong>Pro tip:</strong> You can use ModalHeader, ModalBody, and ModalFooter for better structure.
            </div>
          </ModalBody>
          
          <ModalFooter>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #2563eb',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
};

export const ConfirmationModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleDelete = () => {
      alert('Item deleted!');
      setIsOpen(false);
    };
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer',
            backgroundColor: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Delete Item
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="⚠️ Confirm Deletion"
          size="sm"
        >
          <ModalBody>
            <p><strong>Are you sure you want to delete this item?</strong></p>
            <p>This action cannot be undone. The item will be permanently removed from your account.</p>
          </ModalBody>
          
          <ModalFooter>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button 
              onClick={handleDelete}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #ef4444',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Delete
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
};

export const FormModal: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      alert('Form submitted!');
      setIsOpen(false);
    };
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Add New User
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="Add New User"
          size="md"
        >
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label htmlFor="fullname" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    Full Name
                  </label>
                  <input 
                    id="fullname"
                    type="text" 
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    Email Address
                  </label>
                  <input 
                    id="email"
                    type="email" 
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="role" style={{ display: 'block', marginBottom: '0.25rem', fontWeight: '500' }}>
                    Role
                  </label>
                  <select 
                    id="role" 
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '4px',
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>
                
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" />
                    Send welcome email
                  </label>
                </div>
              </div>
            </ModalBody>
            
            <ModalFooter>
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                style={{ 
                  padding: '8px 16px', 
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                type="submit"
                style={{ 
                  padding: '8px 16px', 
                  border: '1px solid #16a34a',
                  backgroundColor: '#16a34a',
                  color: 'white',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add User
              </button>
            </ModalFooter>
          </form>
        </Modal>
      </div>
    );
  },
};

export const ScrollableContent: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const longContent = Array.from({ length: 50 }, (_, i) => (
      <p key={i}>
        This is paragraph {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    ));
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Open Scrollable Modal
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="📜 Long Content Modal"
          size="lg"
        >
          <ModalBody>
            <p><strong>This modal has scrollable content.</strong></p>
            {longContent}
          </ModalBody>
          
          <ModalFooter>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
};

export const NonDismissible: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Open Non-Dismissible Modal
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          closeOnOverlayClick={false}
          closeOnEscapeKey={false}
          title="⚠️ Important Notice"
        >
          <ModalBody>
            <p><strong>This modal cannot be dismissed by clicking outside or pressing Escape.</strong></p>
            <p>You must explicitly click one of the buttons below to close it.</p>
            <p>This is useful for critical confirmations or when you need to ensure the user makes a choice.</p>
          </ModalBody>
          
          <ModalFooter>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                padding: '8px 16px', 
                border: '1px solid #d1d5db',
                backgroundColor: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              I Understand
            </button>
          </ModalFooter>
        </Modal>
      </div>
    );
  },
};

export const WithoutHeader: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Open Modal Without Header
        </button>
        
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <ModalBody>
            <h2 style={{ margin: '0 0 1rem 0' }}>Custom Content</h2>
            <p>This modal doesn't use the standard header. Instead, the content is completely custom.</p>
            <p>You can still close it by clicking outside or pressing Escape.</p>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ 
                marginTop: '1rem',
                padding: '8px 16px', 
                border: '1px solid #2563eb',
                backgroundColor: '#2563eb',
                color: 'white',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Close Modal
            </button>
          </ModalBody>
        </Modal>
      </div>
    );
  },
};

export const DarkMode: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div>
        <button 
          onClick={() => setIsOpen(true)}
          style={{ padding: '8px 16px', cursor: 'pointer' }}
        >
          Open Dark Mode Modal
        </button>
        
        <Modal 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          title="🌙 Dark Mode Modal"
          isDarkMode={true}
        >
          <p>This modal is rendered in dark mode with appropriate theming.</p>
          <p>The background, text colors, and borders are all adjusted for the dark theme.</p>
        </Modal>
      </div>
    );
  },
  parameters: {
    theme: 'dark',
  },
};