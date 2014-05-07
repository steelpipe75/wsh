/* txt2bin.c */

#include <stdlib.h>
#include <stdio.h>

static void ShowUsage(void);
static FILE *wrap_fopen(const char *pFileName, const char *pMode);
static int char2num(char c, char *pNum);

int main(int argc, char *argv[])
{
	FILE *in_file;
	FILE *out_file;
	
	char ch;
	char i;
	char data8;
	int count;
	
	if(argc != 3){
		ShowUsage();
		exit(-1);
	}
	
	in_file = wrap_fopen(argv[1],"r");
	out_file = wrap_fopen(argv[2],"wb");
	
	count = 0;
	data8 = 0;
	i = 0;
	
	while(fscanf(in_file, "%c", &ch) != EOF){
		if(char2num(ch, &i) == 0){
			count++;
			data8 = (data8 * 16) + i;
			if(count == 2){
				fwrite(&data8, sizeof(data8), 1, out_file);
				count = 0;
				data8 = 0;
			}
		}
	}
	
	fclose(in_file);
	fclose(out_file);
	
	return 0;
}

void ShowUsage(void)
{
	printf("Usage: txt2bin in_file out_file\n");
	
	return;
}

FILE *wrap_fopen(const char *pFileName, const char *pMode)
{
	FILE *pFile;
	
	pFile = fopen(pFileName, pMode);
	
	if(pFile == NULL){
		printf("Error: Can't openfile\n");
		printf("\tFileName = %s\n", pFileName);
		printf("\tMode = %s\n", pMode);
		exit(-1);
	}
	
	return pFile;
}

int char2num(char c, char *pNum)
{
	int ret = 0;
	
	if(('0' <= c) && (c <= '9')){
		*pNum = c - '0';
	}else if(('A' <= c) && (c <= 'F')){
		*pNum = c - 'A' + 10;
	}else if(('a' <= c) && (c <= 'f')){
		*pNum = c - 'a' + 10;
	}else{
		ret = -1;
	}
	
	return ret;
}
