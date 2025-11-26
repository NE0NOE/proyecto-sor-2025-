export function nombreAnonimo() {
  const adjetivos = ["anónimo", "visitante", "lector", "usuario"];
  return adjetivos[Math.floor(Math.random() * adjetivos.length)] + Math.floor(Math.random() * 9999);
}
