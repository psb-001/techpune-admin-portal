import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// One-shot seed: the five hackathons from the Android app's SeedContent, with
// dates relative to today so countdowns stay meaningful. Run once via
// `npx convex run seed:seed`; re-running duplicates rows, so check first.
export const seed = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("hackathons").collect();
    if (existing.length > 0) return { seeded: 0, skipped: existing.length };

    const iso = (days: number) => {
      const d = new Date();
      d.setDate(d.getDate() + days);
      return d.toISOString().slice(0, 10);
    };

    const rows = [
      {
        title: "Global AI Summit Challenge",
        organizer: "Nexus AI",
        description:
          "Join the world's leading AI innovators to build the next generation of intelligent systems. This 72-hour intensive hackathon challenges you to solve real-world problems using cutting-edge machine learning and predictive modeling.",
        location: "Virtual",
        startsOn: iso(20),
        endsOn: iso(23),
        deadline: iso(15),
        prize: "$10,000",
        participants: 450,
        tag: "Artificial Intelligence",
      },
      {
        title: "Decentralized Future Hack",
        organizer: "Ethereum Foundation",
        description:
          "Pioneer the decentralized web. We are looking for innovative dApps, zero-knowledge proofs, and smart contract solutions that push the boundaries of blockchain technology and ensure privacy at scale.",
        location: "Hybrid (Pune & Virtual)",
        startsOn: iso(32),
        endsOn: iso(35),
        deadline: iso(27),
        prize: "$25,000",
        participants: 1200,
        tag: "Web3",
      },
      {
        title: "Creative UI Sprint",
        organizer: "DesignX",
        description:
          "A 24-hour design sprint focused on creating beautiful, accessible, and highly functional user interfaces. Redefine how users interact with technology through thoughtful design systems and micro-interactions.",
        location: "Pune Tech Hub",
        startsOn: iso(45),
        endsOn: iso(45),
        deadline: iso(38),
        prize: "$5,000",
        participants: 300,
        tag: "Design",
      },
      {
        title: "AI for Healthcare Summit",
        organizer: "MedTech Collective",
        description:
          "Building diagnostics tools powered by neural networks. Work alongside clinicians to turn medical imaging and patient data into tools that reach patients faster.",
        location: "Virtual",
        startsOn: iso(58),
        endsOn: iso(61),
        deadline: iso(52),
        prize: "$15,000",
        participants: 620,
        tag: "Artificial Intelligence",
      },
      {
        title: "Eco-Tech Innovation Challenge",
        organizer: "Green Grid Labs",
        description:
          "Green energy solutions for local urban power grids. Prototype something that makes a city's energy use measurably better.",
        location: "Pune Tech Hub",
        startsOn: iso(72),
        endsOn: iso(75),
        deadline: iso(66),
        prize: "$8,000",
        participants: 280,
        tag: "Sustainability",
      },
    ];

    for (const row of rows) {
      await ctx.db.insert("hackathons", row);
    }
    return { seeded: rows.length, skipped: 0 };
  },
});
