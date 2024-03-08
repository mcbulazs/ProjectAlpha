import { Component, Inject } from '@angular/core';
import { MediaComponent } from '../media.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageDataService } from '../../../../services/page.data.service';
import { Channel } from '../../../../interfaces/channel.interface';
import { CHANNEL_LINK_MAX_LENGTH, CHANNEL_NAME_MAX_LENGTH, CHANNEL_TYPES, MAT_SNACKBAR_CONFIG } from '../../../../constants';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-create-channel-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatDialogTitle, MatDialogActions, MatDialogClose, MatSelectModule],
  templateUrl: './create-channel-dialog.component.html',
  styleUrl: './create-channel-dialog.component.scss'
})
export class CreateChannelDialogComponent {

  constructor(public dialogRef: MatDialogRef<MediaComponent>, private pds: PageDataService, private snackBar: MatSnackBar) { }

  channelNameMaxLength = CHANNEL_NAME_MAX_LENGTH;
  channelLinkMaxLength = CHANNEL_LINK_MAX_LENGTH;

  channel: Channel = {
    id: -1,
    link: '',
    name: '',
    site: ''
  }

  channelTypes = CHANNEL_TYPES;

  add() {
    if (this.channel.site === '' || this.channel.name === '' || this.channel.link === '') return;
    this.pds.postChannel(this.channel).subscribe(success => {
      this.snackBar.open(`Channel ${success ? 'added' : 'creation failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    })
  }
}
