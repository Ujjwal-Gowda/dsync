import prisma from "./config/prisma.ts";
import bcrypt from "bcrypt";

async function main() {
    console.log("Cleaning up existing test data...");
    
    const testEmails = [
        "test1@example.com",
        "test2@example.com",
        "test3@example.com",
        "test4@example.com"
    ];

    // Find the test users first so we can clean their records
    const existingUsers = await prisma.user.findMany({
        where: { email: { in: testEmails } }
    });
    const userIds = existingUsers.map(u => u.id);

    if (userIds.length > 0) {
        // Delete activities related to these users
        await prisma.activity.deleteMany({
            where: { userId: { in: userIds } }
        });
        
        // Delete comments by these users
        await prisma.comment.deleteMany({
            where: { userId: { in: userIds } }
        });

        // Delete tasks created by or assigned to these users
        await prisma.task.deleteMany({
            where: { 
                OR: [
                    { createdById: { in: userIds } },
                    { assigneeId: { in: userIds } }
                ]
            }
        });

        // Delete projects created by these users
        await prisma.project.deleteMany({
            where: { createdById: { in: userIds } }
        });

        // Delete workspace memberships for these users
        await prisma.workspaceMembers.deleteMany({
            where: { userId: { in: userIds } }
        });

        // Delete workspaces owned by these users
        await prisma.workspace.deleteMany({
            where: { ownerId: { in: userIds } }
        });

        // Delete users
        await prisma.user.deleteMany({
            where: { id: { in: userIds } }
        });
    }

    console.log("Creating test users...");
    const hashedPassword = await bcrypt.hash("123456", 12);
    
    const usersData = [
        { email: "test1@example.com", name: "Test User One", password: hashedPassword },
        { email: "test2@example.com", name: "Test User Two", password: hashedPassword },
        { email: "test3@example.com", name: "Test User Three", password: hashedPassword },
        { email: "test4@example.com", name: "Test User Four", password: hashedPassword }
    ];

    const users: any[] = [];
    for (const u of usersData) {
        const createdUser = await prisma.user.create({ data: u });
        users.push(createdUser);
        console.log(`Created user: ${createdUser.email}`);
    }

    const [user1, user2, user3, user4] = users;

    console.log("Creating workspaces...");
    const workspacesData = [
        { name: "Alpha Workspace", ownerId: user1.id },
        { name: "Beta Workspace", ownerId: user2.id },
        { name: "Gamma Workspace", ownerId: user3.id }
    ];

    const workspaces: any[] = [];
    for (const w of workspacesData) {
        const createdWorkspace = await prisma.workspace.create({ data: w });
        workspaces.push(createdWorkspace);
        console.log(`Created workspace: ${createdWorkspace.name}`);

        // Add owner as OWNER member
        await prisma.workspaceMembers.create({
            data: {
                workspaceId: createdWorkspace.id,
                userId: w.ownerId,
                role: "OWNER"
            }
        });
    }

    const [workspaceAlpha, workspaceBeta, workspaceGamma] = workspaces;

    console.log("Adding workspace members...");
    // Alpha: User 2 is ADMIN, User 3 is MEMBER
    await prisma.workspaceMembers.createMany({
        data: [
            { workspaceId: workspaceAlpha.id, userId: user2.id, role: "ADMIN" },
            { workspaceId: workspaceAlpha.id, userId: user3.id, role: "MEMBER" }
        ]
    });

    // Beta: User 1 is MEMBER, User 4 is MEMBER
    await prisma.workspaceMembers.createMany({
        data: [
            { workspaceId: workspaceBeta.id, userId: user1.id, role: "MEMBER" },
            { workspaceId: workspaceBeta.id, userId: user4.id, role: "MEMBER" }
        ]
    });

    // Gamma: User 1 is ADMIN
    await prisma.workspaceMembers.createMany({
        data: [
            { workspaceId: workspaceGamma.id, userId: user1.id, role: "ADMIN" }
        ]
    });

    console.log("Creating projects...");
    // Projects for Alpha
    const projectAlpha1 = await prisma.project.create({
        data: {
            name: "Website Redesign",
            description: "Overhaul the main marketing website frontend and layout.",
            workspaceId: workspaceAlpha.id,
            createdById: user1.id,
            status: "ACTIVE"
        }
    });
    const projectAlpha2 = await prisma.project.create({
        data: {
            name: "Mobile App Development",
            description: "Build iOS and Android companion apps.",
            workspaceId: workspaceAlpha.id,
            createdById: user1.id,
            status: "PLANNING"
        }
    });

    // Projects for Beta
    const projectBeta1 = await prisma.project.create({
        data: {
            name: "Marketing Campaign",
            description: "Launch Q3 product updates and email campaigns.",
            workspaceId: workspaceBeta.id,
            createdById: user2.id,
            status: "ACTIVE"
        }
    });
    const projectBeta2 = await prisma.project.create({
        data: {
            name: "Database Migration",
            description: "Migrate legacy database to PostgreSQL.",
            workspaceId: workspaceBeta.id,
            createdById: user2.id,
            status: "ON_HOLD"
        }
    });

    // Projects for Gamma
    const projectGamma1 = await prisma.project.create({
        data: {
            name: "Security Audit",
            description: "Perform penetration testing and code vulnerability scanning.",
            workspaceId: workspaceGamma.id,
            createdById: user3.id,
            status: "PLANNING"
        }
    });

    console.log("Creating tasks with due dates...");
    const now = new Date();

    const getFutureDate = (days: number) => {
        const date = new Date();
        date.setDate(now.getDate() + days);
        return date;
    };

    const getPastDate = (days: number) => {
        const date = new Date();
        date.setDate(now.getDate() - days);
        return date;
    };

    // Tasks for Website Redesign (projectAlpha1)
    await prisma.task.createMany({
        data: [
            {
                title: "Design Homepage Mockups",
                description: "Create high-fidelity UI mockups in Figma.",
                status: "DONE",
                priority: "HIGH",
                dueDate: getFutureDate(3),
                projectId: projectAlpha1.id,
                createdById: user1.id,
                assigneeId: user1.id
            },
            {
                title: "Develop Frontend Layout",
                description: "Code the Next.js home layout using custom CSS.",
                status: "IN_PROGRESS",
                priority: "HIGH",
                dueDate: getFutureDate(7),
                projectId: projectAlpha1.id,
                createdById: user1.id,
                assigneeId: user2.id
            },
            {
                title: "Setup CSS Stylesheet",
                description: "Configure custom design tokens, fonts, and theme switcher.",
                status: "TODO",
                priority: "MEDIUM",
                dueDate: getFutureDate(10),
                projectId: projectAlpha1.id,
                createdById: user1.id,
                assigneeId: user3.id
            }
        ]
    });

    // Tasks for Mobile App (projectAlpha2)
    await prisma.task.createMany({
        data: [
            {
                title: "API Integration",
                description: "Connect to the Express backend OAuth and user routes.",
                status: "TODO",
                priority: "URGENT",
                dueDate: getFutureDate(5),
                projectId: projectAlpha2.id,
                createdById: user1.id,
                assigneeId: user2.id
            },
            {
                title: "App Store Assets",
                description: "Export app icons, splash screens, and screenshots.",
                status: "TODO",
                priority: "LOW",
                dueDate: getFutureDate(14),
                projectId: projectAlpha2.id,
                createdById: user1.id,
                assigneeId: user1.id
            }
        ]
    });

    // Tasks for Marketing Campaign (projectBeta1)
    await prisma.task.createMany({
        data: [
            {
                title: "Write Copy",
                description: "Draft announcement email body and landing page headers.",
                status: "IN_PROGRESS",
                priority: "MEDIUM",
                dueDate: getFutureDate(2),
                projectId: projectBeta1.id,
                createdById: user2.id,
                assigneeId: user3.id
            },
            {
                title: "Design Banners",
                description: "Create social media share images.",
                status: "TODO",
                priority: "LOW",
                dueDate: getFutureDate(6),
                projectId: projectBeta1.id,
                createdById: user2.id,
                assigneeId: user4.id
            }
        ]
    });

    // Tasks for Database Migration (projectBeta2)
    await prisma.task.createMany({
        data: [
            {
                title: "Schema Mapping",
                description: "Map old SQL Server tables to Prisma schema.",
                status: "DONE",
                priority: "HIGH",
                dueDate: getPastDate(2),
                projectId: projectBeta2.id,
                createdById: user2.id,
                assigneeId: user1.id
            },
            {
                title: "Run Migrations",
                description: "Execute migrate deploy on staging environment.",
                status: "IN_PROGRESS",
                priority: "URGENT",
                dueDate: getFutureDate(1),
                projectId: projectBeta2.id,
                createdById: user2.id,
                assigneeId: user2.id
            }
        ]
    });

    // Tasks for Security Audit (projectGamma1)
    await prisma.task.create({
        data: {
            title: "Scan Vulnerabilities",
            description: "Run npm audit and Docker image scans.",
            status: "TODO",
            priority: "HIGH",
            dueDate: getFutureDate(4),
            projectId: projectGamma1.id,
            createdById: user3.id,
            assigneeId: user3.id
        }
    });

    console.log("Database seeded successfully with test data!");
}

main()
    .catch((e) => {
        console.error("Error seeding database:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
