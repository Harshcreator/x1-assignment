export const X1CoinABI = [
  // Read-only functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  
  // State-changing functions
  "function transfer(address to, uint amount) returns (bool)",
  "function burn(uint256 amount) returns (bool)",
  "function mint(address to, uint256 amount) returns (bool)",
  
  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
  "event Burn(address indexed burner, uint256 value)",
  "event Mint(address indexed to, uint256 amount)"
];