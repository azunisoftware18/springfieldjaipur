class ValidateRequest {
  static validate = (schemas) => {
    return async (req, res, next) => {
      try {
        // 🔥 Direct schema (req.body)
        if (schemas?.parseAsync) {
          const parsed = await schemas.parseAsync(req.body);
          Object.assign(req.body, parsed);
          return next();
        }

        // 📦 Body validation
        if (schemas?.body) {
          const parsed = await schemas.body.parseAsync(req.body);
          Object.assign(req.body, parsed);
        }

        // 🔍 Query validation
        if (schemas?.query) {
          const parsed = await schemas.query.parseAsync(req.query);
          Object.assign(req.query, parsed);
        }

        // 🧾 Params validation
        if (schemas?.params) {
          const parsed = await schemas.params.parseAsync(req.params);
          Object.assign(req.params, parsed);
        }

        next();
      } catch (error) {
        next(error);
      }
    };
  };
}

export default ValidateRequest;
