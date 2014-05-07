/* bin2txt.c */

#include <stdlib.h>
#include <stdio.h>

static void ShowUsage(void);
static FILE *wrap_fopen(const char *pFileName, const char *pMode);

int main(int argc, char *argv[])
{
	FILE *in_file;
	FILE *out_file;
	
	char ch;
		
	if(argc != 3){
		ShowUsage();
		exit(-1);
	}
	
	in_file = wrap_fopen(argv[1],"rb");
	out_file = wrap_fopen(argv[2],"w");
	
	while(fread(&ch, sizeof(char), 1, in_file) != 0){
		fprintf(out_file, "%02X", ch);
	}
	
	fclose(in_file);
	fclose(out_file);
	
	return 0;
}

void ShowUsage(void)
{
	printf("Usage: bin2txt in_file out_file\n");
	
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
