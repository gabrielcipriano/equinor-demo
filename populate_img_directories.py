from os import path
from pathlib import Path
import json
import shutil

BASEDIR = 'public/img/'

newDirs = ['PEREGRINO_B_ASBUILT_COL_0',
'PEREGRINO_B_ASBUILT_COL_1',
'PEREGRINO_B_ASBUILT_COL_2',
'PEREGRINO_B_ASBUILT_COL_3',
'PEREGRINO_B_ASBUILT_COL_4',
'PEREGRINO_B_ASBUILT_COL_5',
'PEREGRINO_B_ASBUILT_COL_6',
'PEREGRINO_B_ASBUILT_COL_7',
'PEREGRINO_B_ASBUILT_EXTERNO_0',
'PEREGRINO_B_ASBUILT_EXTERNO_1',
'PEREGRINO_B_ASBUILT_EXTERNO_2',
'PEREGRINO_B_ASBUILT_EXTERNO_3',
'PEREGRINO_B_ASBUILT_EXTERNO_4',
'PEREGRINO_B_ASBUILT_EXTERNO_5',
'PEREGRINO_B_ASBUILT_EXTERNO_6',
'PEREGRINO_B_ASBUILT_EXTERNO_7',
'PEREGRINO_B_ASBUILT_INTERNO_0',
'PEREGRINO_B_ASBUILT_INTERNO_1']


for _dir in newDirs:
    Path(path.dirname(__file__)+"/"+BASEDIR+_dir).mkdir(parents=True, exist_ok=True)

with open('public/info.json', 'r') as f:
    structure_images_info = json.load(f)

    print(f"Working directory:", BASEDIR)

    for structure_name, info in  structure_images_info.items():
        if structure_name in newDirs:
            for image in info['images']:
                try:
                    shutil.copy2(BASEDIR+image['name'], BASEDIR+structure_name+'/')
                    print(f"File {image['name']} copied to /{structure_name}")
                # If source and destination are same
                except shutil.SameFileError:
                    print("Source and destination represents the same file.")
                
                # If destination is a directory.
                except IsADirectoryError:
                    print("Destination is a directory.")
                
                # If there is any permission issue
                except PermissionError:
                    print("Permission denied.")
                
                # For other errors
                except Exception as err:
                    print(err)
                    print("Error occurred while copying file.")
