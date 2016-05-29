import {Component, OnInit, Input, Output, EventEmitter} from "@angular/core";
import {CommuteFrequency} from "../model/commute_frequency";

@Component({
  moduleId: module.id,
  selector: 'app-select-for-consume-type',
  templateUrl: 'select-for-consume-type.component.html',
  styleUrls: ['select-for-consume-type.component.css']
})
export class SelectForConsumeTypeComponent implements OnInit {
    @Input() commuteFrequencies:CommuteFrequency[];

    @Input() public commuteFrequency:CommuteFrequency;
  // according to http://stackoverflow.com/a/35639690/873282, we have to do two-way data binding using EventEmitter
    @Output() commuteFrequencyChange:EventEmitter<CommuteFrequency> = new EventEmitter<CommuteFrequency>();

  constructor() {}

  ngOnInit() {}

}
