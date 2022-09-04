import { Component, Injectable } from '@angular/core';
import { CapacitorVideoPlayer } from 'capacitor-video-player';
import { ModalController } from '@ionic/angular';

import { HTTP } from '@awesome-cordova-plugins/http/ngx';

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-videos',
  templateUrl: './videos.page.html',
  styleUrls: ['./videos.page.scss'],
})
export class VideosPage  {

  private capacitorVideoPlayer: any = CapacitorVideoPlayer;

  private testEmbedUrls: any[string] = [
    'https://fembed.com/v/7zv-jnkg2ox',
    'https://fembed.com/v/3q91j75d29y',
    'https://fembed.com/v/4dvjxzd0y91'
  ];

//  private _embed_url = 'https://fembed.com/v/7zv-jnkg2ox';

  constructor(private http: HTTP, private modalCtrl: ModalController) {
    this.playVideo(this.testEmbedUrls[0]);
  }

  public async closeModal(){
    this.leaveModal();
  }


  async playVideo(embedUrl: string) {

    this.fembedResolver(embedUrl).then((videos) => {
      this.nativePlayer2(videos[0], 'Title', 'smallTitle');
    });
  }

  // With this you get raw videos
  async fembedResolver(url: string) {
    url = url.replace('fembed.com', 'vanfem.com');
    url = url.replace('/v/', '/api/source/');

    return new Promise((resolve, reject) => {

      this.http.post(url, {}, {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Referer: url
      }).then(data => {
        console.log(data.data);
        const json = JSON.parse(data.data);
        const mVideos = json.data;
        const videos = [];

        mVideos.forEach(video => {
          videos.push({
            label: video.label,
            file: video.file,
            referer: url
          });
        });
        const document = videos;
        resolve(document);
      }).catch(err => {
        reject(err);
      });
    });
  }

  async nativePlayer2(video: any, title, smallTitle) {

    console.log('URL: ',encodeURI(video.file));
    await this.capacitorVideoPlayer.initPlayer({
      mode: 'fullscreen',
      url: encodeURI(video.file),
      playerId: 'player1',
      headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      Referer: video.referer
      },
      title,
      smallTitle,
      accentColor: '#f0b400',
      chromecast: true
    }).then(() => {
      console.log('Player initialized');
      this.capacitorVideoPlayer.play({playerId: 'player1'}).then(() => {
        //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.ANY);
        console.log('Player playing');

      }).catch(err => {
        console.log('Error playing', err);
        this.capacitorVideoPlayer.stopAllPlayers().then(() => {
          console.log('All players stopped');
        });
      });
    }).catch(err => {
      console.log('Error initializing player', err);
      this.capacitorVideoPlayer.stopAllPlayers().then(() => {
        console.log('All players stopped');
      });
    });

    await this.capacitorVideoPlayer.addListener('jeepCapVideoPlayerExit', async (data) => {
      console.log('Player exited');
      //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      await this.leaveModal();

    });

    await this.capacitorVideoPlayer.addListener('jeepCapVideoPlayerEnded', async (data) => {
      console.log('Player ended');
      //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      await this.leaveModal();
    });
  }
  async leaveModal(): Promise<void> {
    await this.capacitorVideoPlayer.stopAllPlayers();
    this.modalCtrl.dismiss({
      dismissed: true
    });
    return;
  }
}
