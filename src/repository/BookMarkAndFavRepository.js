import BookMarkandFav from '../model/BookMarkAndFavModel.js'

class BookMarkAndFavModel {

    async reactBlog({blogid,type,userId}){
       
        const checkexist = await BookMarkandFav.find({userID:userId,blogID:blogid});
        const checkexist2 = await BookMarkandFav.find({userID:userId,blogID:blogid,type:type});
    
        if(checkexist.length===0)
            BookMarkandFav.create({userID:userId,blogID:blogid,type:type});
        else if(checkexist2.length===0)
            BookMarkandFav.create({userID:userId,blogID:blogid,type:type});
        else
            BookMarkandFav.deleteOne({userID:userId,blogID:blogid,type:type}).exec();
    }

}

export default new BookMarkAndFavModel()