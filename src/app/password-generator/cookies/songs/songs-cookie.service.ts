import { Injectable } from '@angular/core';
import { GeneratorCookiesService } from '../generator-cookies.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Mapping } from '../../commons/mapping';

@Injectable()
export class SongsCookieService {

  constructor(private cookieService: GeneratorCookiesService, private formBuilder: FormBuilder) { }

  private readonly COOKIE_NAME = 'rwfs_character_groups';

  private readonly DEFAULT_COOKIE_VALUE = {
    mappings: [
      {
        mappedCharacter: 's',
        mappings: '5T$',
        mappingChance: 50
      }, {
        mappedCharacter: 'a',
        mappings: '@4',
        mappingChance: 50
      }, {
        mappedCharacter: 'b',
        mappings: '8D',
        mappingChance: 50
      }, {
        mappedCharacter: 't',
        mappings: '5sS',
        mappingChance: 50
      }, {
        mappedCharacter: 'o',
        mappings: '0u',
        mappingChance: 50
      }, {
        mappedCharacter: 'i',
        mappings: 'l1!',
        mappingChance: 50
      }, {
        mappedCharacter: 'z',
        mappings: 's',
        mappingChance: 50
      }, {
        mappedCharacter: 'q',
        mappings: 'o',
        mappingChance: 50
      }
    ],
    passwordLength: 12,
    rwCase: 'random',
    artist: 'Myslovitz'
  };

  public setCookie(data: FormGroup) {
    const passwordLength = data.get('password_length') as FormControl;
    const artist = data.get('artist') as FormControl;
    const caseMode = data.get('rwfsCase') as FormControl;
    const mappings = data.get('character_mappings') as FormArray;
    this.cookieService.setCookie(this.COOKIE_NAME, {
      mappings: mappings.getRawValue().map(mapping => {
        return new Mapping(mapping.character, mapping.mapping, mapping.chance);
      }),
      passwordLength: passwordLength.value,
      rwCase: caseMode.value,
      artist: artist.value,
      lyricsLine: ''
    });
  }

  public getCookie(): FormGroup {
    const cookieValue = this.cookieService.getCookieValue(this.COOKIE_NAME, this.DEFAULT_COOKIE_VALUE);
    return this.formBuilder.group({
      password_length: [cookieValue.passwordLength, [Validators.required, Validators.min(12)]],
      character_mappings: this.formBuilder.array(
        cookieValue.mappings.map(mapping => this.formBuilder.group({
          character: [mapping.mappedCharacter, Validators.required],
          mapping: [mapping.mappings, Validators.required],
          chance: [mapping.mappingChance, Validators.required]
        }))
      ),
      rwfsCase: [cookieValue.rwCase, Validators.required],
      artist: [cookieValue.artist, Validators.required],
      lyricsLine: ['', Validators.required]
    });
  }
}
