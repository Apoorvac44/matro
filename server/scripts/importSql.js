const fs = require('fs');
const path = require('path');
const { sequelize } = require('../config/db');

const importSql = async () => {
    try {
        const sqlFilePath = 'C:\\Users\\Administrator\\Downloads\\matrimony.sql';
        console.log(`Reading SQL file from: ${sqlFilePath}`);

        if (!fs.existsSync(sqlFilePath)) {
            console.error('SQL file not found! Please make sure matrimony.sql is in your Downloads folder.');
            process.exit(1);
        }

        const sql = fs.readFileSync(sqlFilePath, 'utf8');

        // Split SQL into individual statements
        // Note: Simple split by ; might fail if ; exists in strings, but for most dumps it works.
        const statements = sql.split(/;\s*$/m);

        console.log('Starting migration...');
        for (let statement of statements) {
            if (statement.trim()) {
                await sequelize.query(statement);
            }
        }

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error.message);
        process.exit(1);
    }
};

importSql();
