const { sequelize, connectDB } = require('./src/config/db');
const Herb = require('./src/models/Herb');
const Medicine = require('./src/models/Medicine');
const Interaction = require('./src/models/Interaction');

const seedData = async () => {
    await connectDB();
    await sequelize.sync({ force: true }); // Reset DB

    // Herbs
    const herbs = await Herb.bulkCreate([
        { name: 'Ashwagandha', dosha: 'Vata, Kapha', benefits: 'Reduces stress, improves vitality, boosts immunity, enhances muscle strength.', safety_notes: 'Avoid in pregnancy. May cause drowsiness. Use caution with thyroid medication.' },
        { name: 'Tulsi', dosha: 'Vata, Kapha', benefits: 'Respiratory health, stress relief, antimicrobial, boosts immunity.', safety_notes: 'May have blood-thinning effects. Avoid if trying to conceive.' },
        { name: 'Brahmi', dosha: 'Pitta, Kapha', benefits: 'Improves memory, reduces anxiety, promotes hair growth.', safety_notes: 'May cause stomach upset on empty stomach. Safe for long-term use in moderation.' },
        { name: 'Turmeric (Haridra)', dosha: 'Vata, Kapha', benefits: 'Anti-inflammatory, antimicrobial, improves skin health, supports digestion.', safety_notes: 'High doses may cause stomach upset. Caution with blood thinners.' },
        { name: 'Ginger (Adrak)', dosha: 'Vata, Kapha', benefits: 'Aids digestion, reduces nausea, anti-inflammatory.', safety_notes: 'Avoid in high Pitta (acidity, ulcers). May thin blood.' },
        { name: 'Triphala', dosha: 'Tridoshic', benefits: 'Gentle laxative, detoxifies, supports eye health, antioxidant rich.', safety_notes: 'Safe for most. Avoid during pregnancy due to downward energy (Apana Vayu).' },
        { name: 'Guduchi (Giloy)', dosha: 'Pitta, Kapha', benefits: 'Immunomodulator, reduces fever, supports liver function.', safety_notes: 'Generally safe. Caution in autoimmune conditions due to immune boosting.' },
        { name: 'Shatavari', dosha: 'Vata, Pitta', benefits: 'Supports female reproductive health, cools body, reduces acidity.', safety_notes: 'Avoid if there is high Kapha (congestion, weight gain).' },
        { name: 'Neem', dosha: 'Pitta, Kapha', benefits: 'Purifies blood, supports skin health, antimicrobial.', safety_notes: 'Very cooling. Avoid in high Vata (dryness, cold). Not for pregnancy.' },
        { name: 'Amla (Amalaki)', dosha: 'Tridoshic', benefits: 'Rich in Vitamin C, anti-aging, supports immunity and digestion.', safety_notes: 'Generally safe. Can increase cooling in body.' },
        { name: 'Licorice (Yashtimadhu)', dosha: 'Vata, Pitta', benefits: 'Soothes throat, supports adrenals, heals ulcers.', safety_notes: 'Avoid in high blood pressure and pregnancy. Can cause potassium loss.' },
        { name: 'Arjuna', dosha: 'Pitta, Kapha', benefits: 'Supports heart health, reduces blood pressure, emotionally grounding.', safety_notes: 'Consult physician if on heart medication.' },
    ]);

    // Medicines
    const medicines = await Medicine.bulkCreate([
        { name: 'Aspirin', drug_class: 'NSAID / Blood Thinner' },
        { name: 'Warfarin', drug_class: 'Anticoagulant' },
        { name: 'Diazepam', drug_class: 'Benzodiazepine / Sedative' },
        { name: 'Metformin', drug_class: 'Antidiabetic' },
        { name: 'Atorvastatin', drug_class: 'Statin (Cholesterol)' },
        { name: 'Omeprazole', drug_class: 'Proton Pump Inhibitor (Acid Reflux)' },
        { name: 'Ibuprofen', drug_class: 'NSAID (Pain Reliever)' },
        { name: 'Levothyroxine', drug_class: 'Thyroid Hormone' },
        { name: 'Amlodipine', drug_class: 'Calcium Channel Blocker (Blood Pressure)' },
        { name: 'Insulin', drug_class: 'Antidiabetic Hormone' },
    ]);

    // Helper to find ID by name
    const findHerb = (name) => herbs.find(h => h.name === name).id;
    const findMed = (name) => medicines.find(m => m.name === name).id;

    // Interactions
    await Interaction.bulkCreate([
        { herb_id: findHerb('Ashwagandha'), medicine_id: findMed('Diazepam'), risk_level: 'CAUTION', explanation: 'Ashwagandha may increase the sedative effects of Diazepam and other sedatives.' },
        { herb_id: findHerb('Ashwagandha'), medicine_id: findMed('Levothyroxine'), risk_level: 'CAUTION', explanation: 'Ashwagandha may stimulate thyroid function; monitor TSH levels if on Levothyroxine.' },
        { herb_id: findHerb('Tulsi'), medicine_id: findMed('Warfarin'), risk_level: 'AVOID', explanation: 'Tulsi may enhance the blood-thinning effect of Warfarin, increasing bleeding risk.' },
        { herb_id: findHerb('Tulsi'), medicine_id: findMed('Aspirin'), risk_level: 'CAUTION', explanation: 'Combined use may increase risk of bleeding due to additive antiplatelet effects.' },
        { herb_id: findHerb('Turmeric (Haridra)'), medicine_id: findMed('Warfarin'), risk_level: 'AVOID', explanation: 'Turmeric (Curcumin) enhances anti-coagulant effects of Warfarin. High bleeding risk.' },
        { herb_id: findHerb('Turmeric (Haridra)'), medicine_id: findMed('Aspirin'), risk_level: 'CAUTION', explanation: 'Turmeric may increase bleeding risk when taken with Aspirin.' },
        { herb_id: findHerb('Turmeric (Haridra)'), medicine_id: findMed('Omeprazole'), risk_level: 'BENEFICIAL', explanation: 'Turmeric may heal gut lining, complementing Omeprazoles ulcer treatment, but consult doctor.' },
        { herb_id: findHerb('Ginger (Adrak)'), medicine_id: findMed('Warfarin'), risk_level: 'CAUTION', explanation: 'Ginger has mild blood-thinning properties. Monitor INR if on Warfarin.' },
        { herb_id: findHerb('Ginger (Adrak)'), medicine_id: findMed('Metformin'), risk_level: 'BENEFICIAL', explanation: 'Ginger may help lower blood sugar, potentially enhancing Metformin effects. Monitor glucose.' },
        { herb_id: findHerb('Guduchi (Giloy)'), medicine_id: findMed('Insulin'), risk_level: 'CAUTION', explanation: 'Guduchi seeds may lower blood sugar additives to Insulin. Monitor for hypoglycemia.' },
        { herb_id: findHerb('Neem'), medicine_id: findMed('Metformin'), risk_level: 'CAUTION', explanation: 'Neem may lower blood sugar. Combined with Metformin, it could cause hypoglycemia.' },
        { herb_id: findHerb('Neem'), medicine_id: findMed('Insulin'), risk_level: 'CAUTION', explanation: 'Neem enhances insulin sensitivity. Dose adjustment for Insulin may be needed.' },
        { herb_id: findHerb('Licorice (Yashtimadhu)'), medicine_id: findMed('Amlodipine'), risk_level: 'AVOID', explanation: 'Licorice can raise blood pressure and counteract Amlodipine effects.' },
        { herb_id: findHerb('Licorice (Yashtimadhu)'), medicine_id: findMed('Levothyroxine'), risk_level: 'CAUTION', explanation: 'Licorice may lower potassium levels, which can be risky if on certain heart/BP meds.' },
    ]);

    console.log('✅ Database Seeded Successfully');
    process.exit();
};

seedData().catch((err) => {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
});
