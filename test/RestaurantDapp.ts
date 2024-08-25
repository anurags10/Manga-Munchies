import { expect } from 'chai';
import { ethers } from 'hardhat';
import { RestaurantDApp, RestaurantDApp__factory } from '../typechain-types';

describe ('RestaurantDapp', () => {
    let restaurantDapp: RestaurantDApp;
    let owner: any;
    let customer: any;

    beforeEach(async () => {
        [owner,customer] = await ethers.getSigners();
        const RestaurantDappFactory = await ethers.getContractFactory('RestaurantDApp');
        restaurantDapp = await RestaurantDappFactory.deploy("MangaMunchies","MAM","https://bafybeie3uhtodiu742ozb7yiuphzvmyvtek2uuhz3wnvxb35csfw2cngwy.ipfs.w3s.link/manga_munchies.json",owner);
        await restaurantDapp.waitForDeployment();
        // console.log('====================================');
        // console.log("RestaurantDapp is deployed to:",await restaurantDapp.getAddress()); 
        // // 0x5FbDB2315678afecb367f032d93F642f64180aa3
        // console.log('====================================');
    })
    it ("should have correct nft name and symbol", async()=>{
        expect(await restaurantDapp.name()).to.equal("MangaMunchies");
        expect(await restaurantDapp.symbol()).to.equal("MAM");
    })
    it ("should be owner",async () => {
        expect(await restaurantDapp.owner()).to.equal(owner);
        
    })

    it ("should allow customers to place order and track their order count",async () => {
       await restaurantDapp.connect(customer).placeOrder();
       await restaurantDapp.connect(customer).placeOrder();
       
       expect(await restaurantDapp.orderCount(customer.address)).to.equal(2);
    //    console.log(customer.address);
    })

    it ("should mint the NFT when customer reaches 100 order", async () =>{
        for (let i = 0; i < 100; i++) {
            await restaurantDapp.connect(customer).placeOrder();
        }


        expect(await restaurantDapp.orderCount(customer.address)).to.equal(100);
        expect(await restaurantDapp.hasReceivedNFT(customer.address)).to.equal(true);
        expect(await restaurantDapp.balanceOf(customer.address)).to.equal(1);
    })

    it ("should emit an event when customer reached 100 order milestone", async () =>{
        for (let i = 0; i < 99; i++) {
            await restaurantDapp.connect(customer).placeOrder();
        }

        await expect (restaurantDapp.connect(customer).placeOrder())
            .to.emit(restaurantDapp,"MilestoneNFTIssued")
            .withArgs(customer.address,1);   
    })

    it ("should allow owner to set newbaseURI", async() =>{
        const newBaseURI = "https://newexample.com/metadata/";
        await restaurantDapp.connect(owner).setBaseURI(newBaseURI);
        // console.log(await owner.address);
        
        expect (await restaurantDapp.baseURI()).to.equal(newBaseURI);
    })

    // it ("should not allow non-owner to set new baseURI", async () =>{
    //     const newBaseURI = "https://newexample.com/metadata/";

    //     expect(await restaurantDapp.connect(customer).setBaseURI(newBaseURI))
    //         .to.be.reverted(`Error: VM Exception while processing transaction: reverted with custom error 'OwnableUnauthorizedAccount("${customer.address}")'`);
    // })
})