import { Router } from 'express';

const router = Router();

// In-memory case storage for testing (replace with real database in production)
let cases: any[] = [];
let caseIdCounter = 1;

// Generate mock cases for testing
const generateMockCases = () => {
  const categories = ['TAX', 'LICENSE', 'PERMIT'];
  const priorities = ['LOW', 'MEDIUM', 'HIGH'];
  const statuses = ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED'];
  const names = ['Asha Verma', 'John Doe', 'Li Wei', 'Maria Santos', 'Ahmed Khan'];

  for (let i = 0; i < 50; i++) {
    cases.push({
      id: String(caseIdCounter++),
      case_id: `C-${1000 + i}`,
      applicant_name: names[Math.floor(Math.random() * names.length)],
      dob: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString(),
      email: `user${i}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      category: categories[Math.floor(Math.random() * categories.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      assignee: Math.random() > 0.5 ? 'Test User' : undefined,
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Test User',
    });
  }
};

// Initialize with mock data
generateMockCases();

// Get all cases with pagination and filters
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const status = req.query.status as string;
    const category = req.query.category as string;
    const priority = req.query.priority as string;

    let filteredCases = [...cases];

    // Apply filters
    if (search) {
      filteredCases = filteredCases.filter(
        (c) =>
          c.case_id.toLowerCase().includes(search.toLowerCase()) ||
          c.applicant_name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (status) {
      filteredCases = filteredCases.filter((c) => c.status === status);
    }
    if (category) {
      filteredCases = filteredCases.filter((c) => c.category === category);
    }
    if (priority) {
      filteredCases = filteredCases.filter((c) => c.priority === priority);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCases = filteredCases.slice(startIndex, endIndex);

    res.json({
      cases: paginatedCases,
      total: filteredCases.length,
      page,
      limit,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get single case by ID
router.get('/:id', (req, res) => {
  try {
    const caseItem = cases.find((c) => c.id === req.params.id);
    
    if (!caseItem) {
      return res.status(404).json({ message: 'Case not found' });
    }

    return res.json(caseItem);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Create new case
router.post('/', (req, res) => {
  try {
    const { case_id, applicant_name, dob, email, phone, category, priority } = req.body;

    // Validate required fields
    if (!case_id || !applicant_name || !dob || !category || !priority) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate category
    const validCategories = ['TAX', 'LICENSE', 'PERMIT'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    // Validate priority
    const validPriorities = ['LOW', 'MEDIUM', 'HIGH'];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({ message: 'Invalid priority' });
    }

    const newCase = {
      id: String(caseIdCounter++),
      case_id,
      applicant_name,
      dob,
      email,
      phone,
      category,
      priority,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Test User',
    };

    cases.push(newCase);
    return res.status(201).json(newCase);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Import cases from CSV
router.post('/import', (req, res) => {
  try {
    const { cases: newCases } = req.body;

    if (!Array.isArray(newCases) || newCases.length === 0) {
      return res.status(400).json({ message: 'Invalid cases data' });
    }

    const importedCases: any[] = [];
    const errors: any[] = [];

    newCases.forEach((caseData, index) => {
      try {
        const newCase = {
          id: String(caseIdCounter++),
          ...caseData,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: 'Test User',
        };

        cases.push(newCase);
        importedCases.push(newCase);
      } catch (error: any) {
        errors.push({
          row: index + 1,
          message: error.message,
        });
      }
    });

    return res.json({
      success: importedCases.length,
      failed: errors.length,
      errors,
      cases: importedCases,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Update case (PATCH)
router.patch('/:id', (req, res) => {
  try {
    const caseIndex = cases.findIndex((c) => c.id === req.params.id);
    
    if (caseIndex === -1) {
      return res.status(404).json({ message: 'Case not found' });
    }

    cases[caseIndex] = {
      ...cases[caseIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.json(cases[caseIndex]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Update case (PUT)
router.put('/:id', (req, res) => {
  try {
    const caseIndex = cases.findIndex((c) => c.id === req.params.id);
    
    if (caseIndex === -1) {
      return res.status(404).json({ message: 'Case not found' });
    }

    cases[caseIndex] = {
      ...cases[caseIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    return res.json(cases[caseIndex]);
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

// Delete case
router.delete('/:id', (req, res) => {
  try {
    const caseIndex = cases.findIndex((c) => c.id === req.params.id);
    
    if (caseIndex === -1) {
      return res.status(404).json({ message: 'Case not found' });
    }

    cases.splice(caseIndex, 1);
    return res.json({ message: 'Case deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
