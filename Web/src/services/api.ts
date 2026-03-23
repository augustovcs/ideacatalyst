export const returnAPImsg = async () => {
  const response = await fetch("http://localhost:5068/api/input/ideabystatus")
  return await response.json()
}