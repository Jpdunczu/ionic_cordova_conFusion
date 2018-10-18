import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../comment/comment';

/**
 * Generated class for the DishdetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {

  dish: Dish;
  comment: Comment;
  errMsg: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') private BaseURL,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private actionCtrl: ActionSheetController,
    //private socialSharing: SocialSharing,
    private favoriteservice: FavoriteProvider ) {
      this.dish = navParams.get('dish');
      this.favorite = this.favoriteservice.isFavorite(this.dish.id);
      this.numcomments = this.dish.comments.length;

      let total = 0;
      this.dish.comments.forEach(comment => total += comment.rating);
      this.avgstars = (total/this.numcomments).toFixed(2);
  }

  presentActionSheet() {
    let actionSheet = this.actionCtrl.create({
      title: 'Select Actions',
      buttons: [
        {
          text: 'Add to Favorites',
          handler: () => {
            this.addToFavorites();
          }
        },
        {
          text: 'Add Comment',
          handler: () => {
            let commentModal = this.modalCtrl.create(CommentPage);
            commentModal.onDidDismiss(comment => {
              this.comment = comment;
              this.dish.comments.push(this.comment);
            });
            commentModal.present();
          }
        },
        /*
        {
          text: 'Share via Facebook',
          handler: () => {
            this.socialSharing.shareViaFacebook(
              this.dish.name + ' -- ' + this.dish.description,
              this.BaseURL + this.dish.image, '') // in case there is a specific URL to share, the 3rd parameter is used for that.
                .then(() => console.log('Posted successfully to Facebook'))
                .catch(() => console.log('Failed to post to Facebook'));
          }
        },
        {
          text: 'Share via Twitter',
          handler: () => {
            this.socialSharing.shareViaTwitter(
              this.dish.name + ' -- ' + this.dish.description,
              this.BaseURL + this.dish.image, '') // in case there is a specific URL to share, the 3rd parameter is used for that.
                .then(() => console.log('Posted successfully to Twitter'))
                .catch(() => console.log('Failed to post to Twitter'));
          }
        },
        */
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added to favorites successfully.',
      position: 'middle',
      duration: 3000
    }).present();
  }

}
