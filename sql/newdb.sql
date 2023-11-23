-- Create table for users
CREATE TABLE users (
  userId INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  middleName VARCHAR(50),
  lastName VARCHAR(50) NOT NULL,
  profileImage VARCHAR(8000),
  contactNumber VARCHAR(15) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  dateOfBirth DATE,
  address VARCHAR(100),
  password VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL UNIQUE,
  role ENUM('patient', 'doctor', 'admin') NOT NULL
);


-- Create table for blood groups
CREATE TABLE blood_groups (
  bloodGroupId INT AUTO_INCREMENT PRIMARY KEY,
  groupName VARCHAR(10) NOT NULL
);

-- Create table for admin
CREATE TABLE admin (
  adminId INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table for doctors
CREATE TABLE doctors (
  doctorId INT AUTO_INCREMENT PRIMARY KEY,
  specializationId INT,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (specializationId) REFERENCES specializations(specializationId) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Create table for specialization
CREATE TABLE specializations (
  specializationId INT AUTO_INCREMENT PRIMARY KEY,
  specializationName VARCHAR(50) NOT NULL
);



-- Create table for patients
CREATE TABLE patients (
  patientId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  diagnosis VARCHAR(800),
  bloodGroupId INT,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (bloodGroupId) REFERENCES blood_groups(bloodGroupId) ON UPDATE CASCADE
);

-- Create table for doctor-patient appointments
CREATE TABLE appointments (
  appointmentId INT AUTO_INCREMENT PRIMARY KEY,
  appointmentStatus ENUM('completed','pending','cancel') NOT NULL,
  doctorId INT,
  reason VARCHAR(800)
  note VARCHAR(8000)
  patientId INT,
  appointmentDate DATETIME NOT NULL,
  FOREIGN KEY (doctorId) REFERENCES doctors(doctorId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (patientId) REFERENCES patients(patientId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table for notifications
CREATE TABLE notifications (
  notificationId INT AUTO_INCREMENT PRIMARY KEY,
  senderId INT,
  receiverId INT,
  title TEXT,
  message TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (senderId) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (receiverId) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE
);

----------- BLOOD TRANSFUSION MANAGEMENT AND RELATIONS ---------------------------

-- Create table for donors
CREATE TABLE donors (
  donorId INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(50) NOT NULL,
  middleName VARCHAR(50),
  lastName VARCHAR(50) NOT NULL,
  gender ENUM('male', 'female', 'other') NOT NULL,
  dateOfBirth DATE,
  address VARCHAR(100) NOT NULL,
  contactNumber VARCHAR(15) NOT NULL,
  email VARCHAR(50) NOT NULL,
  bloodGroupId INT,
  FOREIGN KEY (bloodGroupId) REFERENCES blood_groups(bloodGroupId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table for requirers
CREATE TABLE requirers (
  requirerId INT AUTO_INCREMENT PRIMARY KEY,
  userId INT,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create table for blood transfusions
CREATE TABLE blood_transfusions (transfusionId INT AUTO_INCREMENT PRIMARY KEY,
  donorId INT,
  recipientId INT,
  transfusionDate DATETIME NOT NULL,
  bloodGroupId INT,
  FOREIGN KEY (donorId) REFERENCES donors(donorId) ON UPDATE CASCADE,
  FOREIGN KEY (recipientId) REFERENCES requirers(requirerId) ON UPDATE CASCADE,
  FOREIGN KEY (bloodGroupId) REFERENCES blood_groups(bloodGroupId) ON UPDATE CASCADE
);

 
