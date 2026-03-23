/**
 * Calculates the completeness score of a user profile based on defined mandatory and optional fields.
 * @param {Object} profile - The user profile object to evaluate.
 * @returns {number} - The completeness score from 0 to 100.
 */
export const calculateCompleteness = (profile) => {
    if (!profile) return 0;

    // Core fields contributing to the score
    const fields = [
        'name', 'age', 'gender', 'location', 'education', 'profession', 'income',
        'profilePicture', 'mobile', 'dob', 'motherTongue', 'maritalStatus', 'height',
        'aboutMe', 'familyType', 'fatherOccupation', 'motherOccupation',
        'star', 'raasi', 'horoscope'
    ];

    // Count filled fields (not empty and not null/undefined)
    const filledCount = fields.filter(f => {
        const val = profile[f];
        return val !== undefined && val !== null && val !== '';
    }).length;

    // Bonus points for gallery photos and interests
    const photoBonus = (profile.photos && profile.photos.length > 0) ? 1 : 0;
    const interestsBonus = (profile.interests && profile.interests.length > 0) ? 1 : 0;

    const totalPossible = fields.length + 2;
    const totalFilled = filledCount + photoBonus + interestsBonus;

    return Math.round((totalFilled / totalPossible) * 100);
};
