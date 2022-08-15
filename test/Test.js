const { expect } = require("chai");
const { hre } = require("hardhat");
const {time} = require("@openzeppelin/test-helpers");

describe("Contract Deployment and Testing",function(){
  let owner,sushicontract,sushicontractInstance,sushibarcontract,sushibarcontractInstance;
  before(async function() {
    
    let accounts = await ethers.getSigners();
    [owner] = accounts;

    console.log(owner.address);

    sushicontract = await ethers.getContractFactory("TestToken");
    sushicontractInstance = await sushicontract.deploy();
    sushibarcontract = await ethers.getContractFactory("SushiBar");
    sushibarcontractInstance = await sushibarcontract.deploy(sushicontractInstance.address);
    


    await sushicontractInstance.deployed();
    await sushibarcontractInstance.deployed();
    await sushicontractInstance.approve(sushibarcontractInstance.address,await sushicontractInstance.totalSupply());
    console.log("Balance",await sushicontractInstance.totalSupply())
    
    await sushibarcontractInstance.enter(200);
  })
  describe("Unstake Check 1", async function () {
    it("Unstaking in less that 2 days", async function () {
        await sushibarcontractInstance.leave(100);
        expect(await sushibarcontractInstance.gettestwithdrawal()).to.be.equal(0);
    })
  })
  describe("Unstake Check 2", async function () {
    it("Unstaking after 2 days and before 4 days", async function () {
        let timeafter3days =(await time.latest()).add(await time.duration.days(3)); 
        await time.increaseTo(timeafter3days.add(await time.duration.seconds(2)));
        await sushibarcontractInstance.leave(30);
        expect(await sushibarcontractInstance.gettestwithdrawal()).to.be.above(0);
    })
  })
  describe("Unstake Check 3", async function () {
    it("Unstaking after 4 days and before 6 days", async function () {
        let timeafter5days =(await time.latest()).add(await time.duration.days(5)); 
        await time.increaseTo(timeafter5days.add(await time.duration.seconds(2)));
        await sushibarcontractInstance.leave(100);
        expect(await sushibarcontractInstance.gettestwithdrawal()).to.be.above(0);
    })
  })
  describe("Unstake Check 4", async function () {
    it("Unstaking after 6 days and before 8 days", async function () {
        let timeafter7days =(await time.latest()).add(await time.duration.days(7)); 
        await time.increaseTo(timeafter7days.add(await time.duration.seconds(2)));
        await sushibarcontractInstance.leave(100);
        expect(await sushibarcontractInstance.gettestwithdrawal()).to.be.above(0);
    })
  })
  describe("Unstake Check 4", async function () {
    it("Unstaking after after 8 days", async function () {
        let timeafter7days =(await time.latest()).add(await time.duration.days(9)); 
        await time.increaseTo(timeafter7days.add(await time.duration.seconds(2)));
        await sushibarcontractInstance.leave(100);
        expect(await sushibarcontractInstance.gettestwithdrawal()).to.be.above(0);
    })
  })

})

