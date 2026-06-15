import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  favorites: [{ type: mongoose.Schema.Types.ObjectId }]
});
const User = mongoose.model('UserTest', UserSchema);

async function test() {
  await mongoose.connect('mongodb://chinmay22032004:Chs%402203@ac-k0mbdu5-shard-00-00.dsk00ft.mongodb.net:27017,ac-k0mbdu5-shard-00-01.dsk00ft.mongodb.net:27017,ac-k0mbdu5-shard-00-02.dsk00ft.mongodb.net:27017/kalaam?ssl=true&replicaSet=atlas-npn8xq-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0');
  
  const id1 = new mongoose.Types.ObjectId();
  const id2 = new mongoose.Types.ObjectId();
  
  const user = new User({ favorites: [id1, id2] });
  await user.save();
  
  console.log('Before:', user.favorites);
  
  await User.updateMany({}, { $pull: { favorites: id1.toString() } });
  
  const fetched = await User.findById(user._id);
  console.log('After string pull:', fetched.favorites);
  
  await User.deleteMany({});
  mongoose.disconnect();
}

test().catch(console.error);
