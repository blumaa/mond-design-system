'use client';

import React, { useState } from 'react';
import {
  Card,
  Stack,
  Box,
  Text,
  Badge,
  Heading,
  Grid,
  Divider,
  Button,
  Input,
  Select,
  RadioGroup,
  Checkbox,
  ProgressStepper,
  Alert,
  Switch,
} from "@mond-design-system/theme";
import { PulseAnimation } from "../../components/PulseAnimation";
import { ModernIcon } from "../../components/ModernIcon";

// Mock ticket data
const festivals = [
  {
    id: "1",
    name: "Electric Dreams 2024",
    date: "July 15-17, 2024",
    location: "Neon Valley, CA",
    icon: "festival" as const,
    status: "available",
    ticketTypes: [
      { id: "general", name: "General Admission", price: 299, perks: ["3-day access", "Food court access", "Parking"] },
      { id: "vip", name: "VIP Experience", price: 599, perks: ["3-day access", "VIP viewing area", "Premium food", "Meet & greet", "Express entry"] },
      { id: "super-vip", name: "Super VIP", price: 1299, perks: ["3-day access", "Backstage access", "Artist dinner", "Hotel package", "Private shuttle"] }
    ]
  },
  {
    id: "2",
    name: "Neon Nights Festival",
    date: "August 22-24, 2024",
    location: "Electric City, NV",
    icon: "star" as const,
    status: "available",
    ticketTypes: [
      { id: "general", name: "Desert Access", price: 249, perks: ["3-day access", "Camping allowed", "Water stations"] },
      { id: "vip", name: "Electric VIP", price: 499, perks: ["3-day access", "Air-conditioned lounge", "Premium drinks", "Artist sessions"] }
    ]
  }
];

const addOns = [
  { id: "camping", name: "Festival Camping", price: 89, description: "3-night camping pass with facilities" },
  { id: "parking", name: "Premium Parking", price: 45, description: "Close parking with shuttle service" },
  { id: "merch", name: "Merchandise Package", price: 75, description: "Official festival t-shirt + poster" },
  { id: "food", name: "Meal Plan", price: 120, description: "All-you-can-eat for 3 days" }
];

export default function TicketBooking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedFestival, setSelectedFestival] = useState(festivals[0]);
  const [selectedTicketType, setSelectedTicketType] = useState('general');
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '18+'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [wantInsurance, setWantInsurance] = useState(false);

  const steps = [
    { id: 'select', title: 'Select Tickets', description: 'Choose festival and ticket type' },
    { id: 'addons', title: 'Add-Ons', description: 'Enhance your experience' },
    { id: 'info', title: 'Your Info', description: 'Personal details' },
    { id: 'payment', title: 'Payment', description: 'Complete purchase' },
    { id: 'confirmation', title: 'Confirmation', description: 'Order complete' }
  ];

  const selectedTicket = selectedFestival.ticketTypes.find(t => t.id === selectedTicketType);
  const addOnTotal = selectedAddOns.reduce((total, addonId) => {
    const addon = addOns.find(a => a.id === addonId);
    return total + (addon ? addon.price : 0);
  }, 0);
  const subtotal = (selectedTicket?.price || 0) * quantity + addOnTotal;
  const fees = subtotal * 0.08;
  const insurance = wantInsurance ? 29 : 0;
  const total = subtotal + fees + insurance;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddOnToggle = (addonId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return selectedTicket && quantity > 0;
      case 1: return true; // Add-ons are optional
      case 2: return guestInfo.firstName && guestInfo.lastName && guestInfo.email;
      case 3: return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && agreeTerms;
      default: return true;
    }
  };

  return (
    <Box bg="surface.background" position="relative" minHeight="100vh">
      <PulseAnimation />

      {/* Modern Header Section */}
      <Box bg="surface.elevated" borderBottom="1px solid" borderColor="border.subtle" py="32" px="32">
        <Stack spacing="8" maxWidth="1400px" mx="auto" align="center">
          <Stack direction="horizontal" spacing="4" align="center">
            <ModernIcon type="diamond" size="xl" />
            <Heading size="4xl" semantic="primary">
              FESTIVAL TICKETS
            </Heading>
            <ModernIcon type="diamond" size="xl" />
          </Stack>
          <Text variant="body-lg" semantic="secondary" align="center">
            Secure your spot at the most electric festivals
          </Text>
          <Badge variant="primary" size="lg">
            <ModernIcon type="star" size="sm" />
            SECURE CHECKOUT
          </Badge>
        </Stack>
      </Box>

      <Box p="32" maxWidth="1400px" mx="auto">
        <Stack spacing="32">

        {/* Progress Stepper */}
        <Box>
          <ProgressStepper
            steps={steps.map((step, index) => ({
              label: step.title,
              description: step.description,
              status: index < currentStep ? 'completed' : index === currentStep ? 'active' : 'disabled'
            }))}
            currentStep={currentStep}
          />
        </Box>

          <div className="responsive-ticket-layout">
            {/* Enhanced Main Content */}
            <Box>
              <Card variant="elevated" padding="40">
                <Stack spacing="24">

                  {/* Step 0: Enhanced Festival Selection */}
                  {currentStep === 0 && (
                    <Stack spacing="20">
                      <Stack spacing="4" align="center">
                        <ModernIcon type="festival" size="xl" />
                        <Heading size="2xl" semantic="primary">
                          Select Your Festival Experience
                        </Heading>
                        <Text variant="body-lg" semantic="secondary" align="center">
                          Choose from our premium festival collection
                        </Text>
                      </Stack>

                    {/* Festival Selection */}
                    <Stack spacing="4">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        Choose Festival
                      </Text>
                      <div className="responsive-cards-grid">
                        {festivals.map((festival) => (
                          <Card
                            key={festival.id}
                            variant={selectedFestival.id === festival.id ? "elevated" : "outlined"}
                            padding="lg"
                          >
                            <Stack spacing="2">
                              <Stack direction="horizontal" justify="between" align="start">
                                <ModernIcon type={festival.icon} size="xl" />
                                <Button
                                  variant={selectedFestival.id === festival.id ? "primary" : "ghost"}
                                  size="sm"
                                  onClick={() => setSelectedFestival(festival)}
                                >
                                  {selectedFestival.id === festival.id ? "SELECTED" : "SELECT"}
                                </Button>
                              </Stack>
                              <Heading size="md" semantic="primary">
                                {festival.name}
                              </Heading>
                              <Text variant="caption" semantic="secondary">
                                {festival.date}
                              </Text>
                              <Text variant="caption" semantic="secondary">
                                {festival.location}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </div>
                    </Stack>

                    {/* Ticket Type Selection */}
                    <Stack spacing="4">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        Choose Ticket Type
                      </Text>
                      <RadioGroup
                        value={selectedTicketType}
                        onChange={setSelectedTicketType}
                        options={selectedFestival.ticketTypes.map((ticket) => ({
                          value: ticket.id,
                          label: `${ticket.name} - $${ticket.price}`
                        }))}
                      />

                      {/* Show ticket details for selected option */}
                      {selectedTicket && (
                        <Card variant="outlined" padding="lg">
                          <Stack spacing="2">
                            <Stack direction="horizontal" spacing="4" align="center">
                              <Text variant="body-md" weight="bold" semantic="primary">
                                {selectedTicket.name}
                              </Text>
                              <Badge variant="primary" size="sm">
                                ${selectedTicket.price}
                              </Badge>
                            </Stack>
                            <Stack direction="horizontal" spacing="2">
                              {selectedTicket.perks.map((perk) => (
                                <Badge key={perk} variant="secondary" size="sm">
                                  {perk}
                                </Badge>
                              ))}
                            </Stack>
                          </Stack>
                        </Card>
                      )}
                    </Stack>

                    {/* Quantity Selection */}
                    <Stack spacing="4">
                      <Text variant="body-md" weight="bold" semantic="primary">
                        Number of Tickets
                      </Text>
                      <Box width="200px">
                        <Input
                          type="number"
                          value={quantity.toString()}
                          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                          min={1}
                          max={8}
                          label="Quantity"
                          inputSize="md"
                        />
                      </div>
                    </Stack>
                  </Stack>
                )}

                {/* Step 1: Add-Ons */}
                {currentStep === 1 && (
                  <Stack spacing="6">
                    <Heading size="lg" semantic="primary">
                      Enhance Your Experience
                    </Heading>
                    <Text variant="body-md" semantic="secondary">
                      Add optional extras to make your festival unforgettable
                    </Text>

                    <div className="responsive-cards-grid">
                      {addOns.map((addon) => (
                        <Card key={addon.id} variant="outlined" padding="lg">
                          <Stack spacing="4">
                            <Stack direction="horizontal" justify="between" align="start">
                              <Stack spacing="2">
                                <Text variant="body-md" weight="bold" semantic="primary">
                                  {addon.name}
                                </Text>
                                <Text variant="body-sm" semantic="secondary">
                                  {addon.description}
                                </Text>
                              </Stack>
                              <Badge variant="primary" size="sm">
                                +${addon.price}
                              </Badge>
                            </Stack>
                            <Checkbox
                              checked={selectedAddOns.includes(addon.id)}
                              onChange={() => handleAddOnToggle(addon.id)}
                              label="Add to order"
                            />
                          </Stack>
                        </Card>
                      ))}
                    </div>

                    <Alert variant="info" title="Pro Tip">
                      <Text variant="body-sm">
                        Save money by bundling add-ons! Camping + Parking + Meal Plan = 15% discount
                      </Text>
                    </Alert>
                  </Stack>
                )}

                {/* Step 2: Guest Information */}
                {currentStep === 2 && (
                  <Stack spacing="6">
                    <Heading size="lg" semantic="primary">
                      Your Information
                    </Heading>

                    <div className="responsive-cards-grid">
                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Personal Details
                        </Text>
                        <Input
                          placeholder="First Name"
                          value={guestInfo.firstName}
                          onChange={(e) => setGuestInfo({...guestInfo, firstName: e.target.value})}
                        />
                        <Input
                          placeholder="Last Name"
                          value={guestInfo.lastName}
                          onChange={(e) => setGuestInfo({...guestInfo, lastName: e.target.value})}
                        />
                        <Input
                          placeholder="Email Address"
                          type="email"
                          value={guestInfo.email}
                          onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                        />
                        <Input
                          placeholder="Phone Number"
                          value={guestInfo.phone}
                          onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})}
                        />
                      </Stack>

                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Age Verification
                        </Text>
                        <Select
                          value={guestInfo.age}
                          onChange={(value) => setGuestInfo({...guestInfo, age: value})}
                          options={[
                            { value: '18+', label: '18+ Years' },
                            { value: '21+', label: '21+ Years' },
                            { value: 'under-18', label: 'Under 18 (Guardian Required)' }
                          ]}
                        />

                        <Alert variant="warning" title="Important">
                          <Text variant="body-sm">
                            Valid ID matching the name on this order will be required at festival entry.
                            Age restrictions apply for certain areas.
                          </Text>
                        </Alert>

                        <Stack spacing="2">
                          <Checkbox
                            label="Subscribe to festival updates and exclusive offers"
                          />
                          <Checkbox
                            label="I agree to receive SMS notifications about my order"
                          />
                        </Stack>
                      </Stack>
                    </div>
                  </Stack>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                  <Stack spacing="6">
                    <Heading size="lg" semantic="primary">
                      Payment Information
                    </Heading>

                    <div className="responsive-cards-grid">
                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Payment Method
                        </Text>
                        <Input
                          placeholder="Card Number"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                        />
                        <div className="responsive-cards-grid">
                          <Input
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                          />
                          <Input
                            placeholder="CVV"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          />
                        </div>
                        <Input
                          placeholder="Cardholder Name"
                          value={paymentInfo.cardholderName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardholderName: e.target.value})}
                        />
                      </Stack>

                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Insurance & Protection
                        </Text>
                        <Card variant="outlined" padding="md">
                          <Stack spacing="2">
                            <Stack direction="horizontal" justify="between" align="center">
                              <Stack spacing="1">
                                <Text variant="body-sm" weight="bold" semantic="primary">
                                  Event Protection Insurance
                                </Text>
                                <Text variant="caption" semantic="secondary">
                                  Full refund if you can&apos;t attend due to covered reasons
                                </Text>
                              </Stack>
                              <Switch
                                checked={wantInsurance}
                                onChange={(e) => setWantInsurance(e.target.checked)}
                                label="Add insurance"
                              />
                            </Stack>
                            {wantInsurance && (
                              <Badge variant="primary" size="sm">
                                +$29 Insurance Fee
                              </Badge>
                            )}
                          </Stack>
                        </Card>

                        <Alert variant="success" title="Secure Payment">
                          <Text variant="body-sm">
                            Your payment information is encrypted and secure. We never store your card details.
                          </Text>
                        </Alert>
                      </Stack>
                    </div>

                    <Divider />

                    <Checkbox
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      label="I agree to the Terms of Service and Privacy Policy"
                    />
                  </Stack>
                )}

                {/* Step 4: Confirmation */}
                {currentStep === 4 && (
                  <Stack spacing="6" align="center">
                    <ModernIcon type="star" size="2xl" />
                    <Heading size="2xl" semantic="primary">
                      ORDER CONFIRMED!
                    </Heading>
                    <Text variant="body-lg" semantic="secondary" align="center">
                      Your tickets have been purchased successfully. Check your email for confirmation and entry details.
                    </Text>

                    <Card variant="elevated" padding="lg">
                      <Stack spacing="4">
                        <Text variant="body-md" weight="bold" semantic="primary">
                          Order #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                        </Text>
                        <Stack direction="horizontal" justify="between">
                          <Text variant="caption" semantic="secondary">Festival</Text>
                          <Text variant="caption" semantic="primary">{selectedFestival.name}</Text>
                        </Stack>
                        <Stack direction="horizontal" justify="between">
                          <Text variant="caption" semantic="secondary">Tickets</Text>
                          <Text variant="caption" semantic="primary">{quantity}x {selectedTicket?.name}</Text>
                        </Stack>
                        <Stack direction="horizontal" justify="between">
                          <Text variant="caption" semantic="secondary">Total Paid</Text>
                          <Text variant="body-md" weight="bold" semantic="primary">${total.toFixed(2)}</Text>
                        </Stack>
                      </Stack>
                    </Card>

                    <Stack direction="horizontal" spacing="4">
                      <Button variant="primary" size="lg">
                        VIEW TICKETS
                      </Button>
                      <Button variant="outline" size="lg">
                        DOWNLOAD PDF
                      </Button>
                    </Stack>
                  </Stack>
                )}

                {/* Navigation Buttons */}
                {currentStep < 4 && (
                  <Stack direction="horizontal" justify="between">
                    <Button
                      variant="ghost"
                      disabled={currentStep === 0}
                      onClick={handleBack}
                    >
                      BACK
                    </Button>
                    <Button
                      variant="primary"
                      disabled={!isStepValid()}
                      onClick={handleNext}
                    >
                      {currentStep === 3 ? 'COMPLETE PURCHASE' : 'CONTINUE'}
                    </Button>
                  </Stack>
                )}
              </Stack>
            </Card>
          </Box>

            {/* Enhanced Order Summary Sidebar */}
            <div className="ticket-sidebar">
              <Stack spacing="8">
              <Card variant="elevated" padding="24">
                <Stack spacing="6">
                  <Stack direction="horizontal" spacing="3" align="center">
                    <ModernIcon type="diamond" size="md" />
                    <Heading size="lg" semantic="primary">
                      ORDER SUMMARY
                    </Heading>
                  </Stack>
                  <Divider />

                <Stack spacing="2">
                  <Stack direction="horizontal" justify="between">
                    <Text variant="caption" semantic="secondary">Festival</Text>
                    <Text variant="caption" semantic="primary">{selectedFestival.name}</Text>
                  </Stack>

                  {selectedTicket && (
                    <>
                      <Stack direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">{selectedTicket.name} x{quantity}</Text>
                        <Text variant="caption" semantic="primary">${(selectedTicket.price * quantity).toFixed(2)}</Text>
                      </Stack>
                    </>
                  )}

                  {selectedAddOns.map((addonId) => {
                    const addon = addOns.find(a => a.id === addonId);
                    return addon ? (
                      <Stack key={addonId} direction="horizontal" justify="between">
                        <Text variant="caption" semantic="secondary">{addon.name}</Text>
                        <Text variant="caption" semantic="primary">${addon.price.toFixed(2)}</Text>
                      </Stack>
                    ) : null;
                  })}

                  <Divider />

                  <Stack direction="horizontal" justify="between">
                    <Text variant="caption" semantic="secondary">Subtotal</Text>
                    <Text variant="caption" semantic="primary">${subtotal.toFixed(2)}</Text>
                  </Stack>

                  <Stack direction="horizontal" justify="between">
                    <Text variant="caption" semantic="secondary">Service Fees</Text>
                    <Text variant="caption" semantic="primary">${fees.toFixed(2)}</Text>
                  </Stack>

                  {wantInsurance && (
                    <Stack direction="horizontal" justify="between">
                      <Text variant="caption" semantic="secondary">Insurance</Text>
                      <Text variant="caption" semantic="primary">${insurance.toFixed(2)}</Text>
                    </Stack>
                  )}

                  <Divider />

                  <Stack direction="horizontal" justify="between">
                    <Text variant="body-md" weight="bold" semantic="primary">Total</Text>
                    <Text variant="body-md" weight="bold" semantic="primary">${total.toFixed(2)}</Text>
                  </Stack>
                </Stack>

                <Text variant="caption" semantic="secondary">
                  Step {currentStep + 1} of {steps.length}
                </Text>
              </Stack>
            </Card>

            {/* Help & Support */}
            <Card variant="outlined" padding="md">
              <Stack spacing="2">
                <Text variant="body-sm" weight="bold" semantic="primary">
                  Need Help?
                </Text>
                <Text variant="caption" semantic="secondary">
                  Our support team is available 24/7 to help with your order.
                </Text>
                <Button variant="outline" size="sm">
                  LIVE CHAT
                </Button>
              </Stack>
            </Card>

            {/* Trust Indicators */}
            <Stack spacing="2">
              <Badge variant="success" size="sm"><ModernIcon type="diamond" size="sm" /> SSL SECURED</Badge>
              <Badge variant="primary" size="sm"><ModernIcon type="crown" size="sm" /> TRUSTED PAYMENT</Badge>
              <Badge variant="secondary" size="sm"><ModernIcon type="music" size="sm" /> MOBILE TICKETS</Badge>
            </Stack>
            </Stack>
            </div>
          </div>
        </Stack>
      </Box>
    </Box>
  );
}