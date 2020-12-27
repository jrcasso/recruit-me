var context = require.context('src/app/spec', true, /spec\.ts$/);
context.keys().forEach(context);
