const { sequelize, connectDB } = require('./src/config/db');
const Herb = require('./src/models/Herb');
const Medicine = require('./src/models/Medicine');
const Interaction = require('./src/models/Interaction');

const seedData = async () => {
    await connectDB();
    await sequelize.sync({ force: true }); // Reset DB

    // Herbs
    const ashwagandha = await Herb.create({
        name: 'Ashwagandha',
        dosha: 'Vata, Kapha',
        benefits: 'Reduces stress, improves vitality, boosts immunity.',
        safety_notes: 'Avoid in pregnancy. May caus drowsiness.',
    });

    const tulsi = await Herb.create({
        name: 'Tulsi',
        dosha: 'Vata, Kapha',
        benefits: 'Respiratory health, stress relief, antimicrobial.',
        safety_notes: 'May have blood-thinning effects.',
    });

    const brahmi = await Herb.create({
        name: 'Brahmi',
        dosha: 'Pitta, Kapha',
        benefits: 'Improves memory, reduces anxiety.',
        safety_notes: 'May cause stomach upset on empty stomach.',
    });

    // Medicines
    const aspirin = await Medicine.create({
        name: 'Aspirin',
        drug_class: 'NSAID / Blood Thinner',
    });

    const warfarin = await Medicine.create({
        name: 'Warfarin',
        drug_class: 'Anticoagulant',
    });

    const diazepam = await Medicine.create({
        name: 'Diazepam',
        drug_class: 'Benzodiazepine / Sedative',
    });

    // Interactions
    await Interaction.create({
        herb_id: ashwagandha.id,
        medicine_id: diazepam.id,
        risk_level: 'CAUTION',
        explanation: 'Ashwagandha may increase the sedative effects of Diazepam.',
    });

    await Interaction.create({
        herb_id: tulsi.id,
        medicine_id: warfarin.id,
        risk_level: 'AVOID',
        explanation: 'Tulsi may enhance the blood-thinning effect of Warfarin, increasing bleeding risk.',
    });

    await Interaction.create({
        herb_id: tulsi.id,
        medicine_id: aspirin.id,
        risk_level: 'CAUTION',
        explanation: 'Combined use may increase risk of bleeding due to additive antiplatelet effects.',
    });

    console.log('✅ Database Seeded Successfully');
    process.exit();
};

seedData().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
