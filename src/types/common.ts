export type Category = 
  | 'All Categories'
  | 'Languages'
  | 'Sports'
  | 'Dance'
  | 'Music'
  | 'Arts'
  | 'Fitness'
  | 'Crafts'
  | 'Business'
  | 'Technology'
  | 'Personal Development'
  | 'Martial Arts'
  | 'Swimming'
  | 'Yoga & Pilates'
  | 'Coding & Robotics'
  | 'Business & Finance'
  | 'Photography'
  | 'Cooking'
  | 'Chess'
  | 'Theatre'
  | 'Public Speaking'
  | 'STEM'
  | 'Early Learning'
  | 'Exam Preparation'
  | 'Corporate Team Building'
  | 'Yoga'
  | 'Pilates'
  | 'Gym'
  | 'Tennis'
  | 'Badminton'
  | 'Pottery'
  | 'Singing'
  | 'Coding'
  | 'Data Analytics'
  | 'Finance'
  | 'Robotics'
  | 'Math'
  | 'English'
  | 'Ballet'
  | 'Football'
  | 'Gymnastics'
  | 'Art'
  | 'Painting'
  | 'Science Club'
  | 'Drama'
  | 'Team Building'
  | 'Leadership'
  | 'AI Workshops'
  | 'Excel'
  | 'Cybersecurity'
  | 'Project Management'
  | 'Design Thinking'
  | 'Innovation Workshops'
  | 'Sales Training'
  | 'Communication Skills';

export type AudienceType = 'Adults' | 'Children' | 'Corporate' | 'All';

export type ActivityType = 'Program' | 'Class' | 'Workshop' | 'Event' | 'Camp' | 'Corporate' | 'Club';
export type ProviderType = 'Studio' | 'Organization' | 'Independent Instructor';

export type ProgramType = 'Program' | 'Session';
export type ProgramTypeFilter = 'All' | 'Program' | 'Session';

export type RegularityType = 
  | 'All'
  | 'Single Session'
  | 'Multi-Session Program'
  | 'Once a Week'
  | 'Twice a Week'
  | 'Three Times a Week'
  | 'Once a Month'
  | 'One-Time Workshop'
  | 'Weekly Program'
  | 'Intensive Program';

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type SkillLevel = 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';

export type DeliveryMode = 'In Person' | 'Live Online' | 'Self-Paced' | 'Hybrid';
export type DeliveryFilter = 'All' | 'In Person' | 'Live Online' | 'Self-Paced' | 'Hybrid';
export type MeetingPlatform = 'Zoom' | 'Google Meet' | 'Microsoft Teams' | 'Custom Platform';
export type BookingType = 'Instant Booking' | 'Request Spot' | 'Subscription' | 'Open Enrollment';

export type GoalType = 
  | 'All Goals'
  | 'Learn'
  | 'Exercise'
  | 'Create'
  | 'Relax'
  | 'Meet People'
  | 'Career'
  | 'Kids';
