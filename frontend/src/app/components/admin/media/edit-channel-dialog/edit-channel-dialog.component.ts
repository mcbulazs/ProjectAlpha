import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogTitle, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CHANNEL_NAME_MAX_LENGTH, CHANNEL_LINK_MAX_LENGTH, MAT_SNACKBAR_CONFIG } from '../../../../constants';
import { Channel } from '../../../../interfaces/channel.interface';
import { PageDataService, ChannelType } from '../../../../services/page.data.service';
import { MediaComponent } from '../media.component';

@Component({
  selector: 'app-edit-channel-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatInput, MatFormField, MatLabel, MatButton, MatHint, MatDialogTitle, MatDialogActions, MatDialogClose],
  templateUrl: './edit-channel-dialog.component.html',
  styleUrl: './edit-channel-dialog.component.scss'
})
export class EditChannelDialogComponent {

  constructor(public dialogRef: MatDialogRef<MediaComponent>, private pds: PageDataService, private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any) { }

  channelNameMaxLength = CHANNEL_NAME_MAX_LENGTH;
  channelLinkMaxLength = CHANNEL_LINK_MAX_LENGTH;

  channel: Channel = {
    id: -1,
    link: '',
    name: '',
  }

  channelType!: ChannelType;
  prettyType = '';
  
  ngOnInit(): void {
    this.channelType = this.data.type;
    this.channel = { ...this.data.channel };
    const typeLowercase = ChannelType[this.channelType].toLowerCase();
    this.prettyType = `${typeLowercase.charAt(0).toUpperCase() + typeLowercase.slice(1)}`;
  }

  update() {
    if (this.channel.name === this.data.channel.name && this.channel.link === this.data.channel.link) {
      this.dialogRef.close();
      return;
    }
    this.pds.patchChannel(this.channel, this.channelType).subscribe(success => {
      this.snackBar.open(`Channel ${success ? 'updated' : 'update failed'}!`, undefined, MAT_SNACKBAR_CONFIG);
      this.dialogRef.close();
    });
  }
}
