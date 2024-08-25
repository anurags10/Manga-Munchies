import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import 'dotenv/config';
const owner_address = process.env.OWNER_ADDRESS;

const MangaModule = buildModule("MangaModule", (m) => {
  const name: string = 'MangaMunchies';
  const symbol:string = 'MAMS';
  const baseURI:string = 'https://bafybeie3uhtodiu742ozb7yiuphzvmyvtek2uuhz3wnvxb35csfw2cngwy.ipfs.w3s.link/manga_munchies.json';
  const owner = owner_address;
  // console.log(owner);
  


  const restaurantDapp = m.contract('RestaurantDApp',[name,symbol,baseURI,owner]);
  return { restaurantDapp };
});

export default MangaModule;
