export function authorizations(roles) {
  return async (req, res, next) => {
    console.log(req.user); // ver el error de req.user undefined
    if (!req.user[0]) return res.status(401).json({ message: "No autorizado" });

    if (!roles.includes(req.user[0].role)) {
      return res.status(401).json({ message: "No tienes permisos" });
    }

    next();
  };
}

