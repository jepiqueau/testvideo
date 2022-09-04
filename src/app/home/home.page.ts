import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { VideosPage } from '../videos/videos.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(public modalCtrl: ModalController) {}

  ngOnInit(): void {
    const platform = Capacitor.getPlatform();
    console.log(`$$$ platform: ${platform}`);
  }
  async goVideosPage() {
    const modal = await this.modalCtrl.create({
      component: VideosPage,
      swipeToClose: true
    });
    await modal.present();
  }

}
